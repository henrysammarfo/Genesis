import solc from 'solc';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { supabaseAdmin } from '@/lib/supabase/server';
import { decrypt } from '@/lib/encryption';

export interface DeploymentResult {
    success: boolean;
    address?: string;
    transactionHash?: string;
    error?: string;
}

export interface CompilationResult {
    success: boolean;
    bytecode?: string;
    abi?: any[];
    error?: string;
}

function findImports(importPath: string) {
    try {
        if (importPath.startsWith('@openzeppelin')) {
            const nodeModulesPath = path.resolve(process.cwd(), 'node_modules', importPath);
            if (fs.existsSync(nodeModulesPath)) {
                return {
                    contents: fs.readFileSync(nodeModulesPath, 'utf8')
                };
            }
        }
        return { error: 'File not found' };
    } catch (e) {
        return { error: 'Error reading file' };
    }
}

export class ContractDeployer {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet | null = null;

    constructor(privateKey?: string, rpcUrl?: string) {
        const defaultRpcUrl = rpcUrl || process.env.SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo';
        this.provider = new ethers.JsonRpcProvider(defaultRpcUrl);

        if (privateKey) {
            this.wallet = new ethers.Wallet(privateKey, this.provider);
            console.log('Deployer initialized with address:', this.wallet.address);
        }
    }

    /**
     * Initialize wallet from user's encrypted ENV variables
     */
    async initializeFromUser(userId: string): Promise<{ success: boolean; error?: string }> {
        try {
            // Fetch user's ENV variables
            const { data, error } = await supabaseAdmin
                .from('user_env_vars')
                .select('key, value')
                .eq('user_id', userId)
                .in('key', ['DEPLOYER_PRIVATE_KEY', 'RPC_URL']);

            if (error) {
                return { success: false, error: 'Failed to fetch deployment credentials' };
            }

            const envVars = data || [];
            const privateKeyVar = envVars.find((v) => v.key === 'DEPLOYER_PRIVATE_KEY');
            const rpcUrlVar = envVars.find((v) => v.key === 'RPC_URL');

            if (!privateKeyVar) {
                return {
                    success: false,
                    error: 'No deployment wallet configured. Please add your wallet in Settings.'
                };
            }

            // Decrypt private key
            const privateKey = decrypt(privateKeyVar.value);
            const rpcUrl = rpcUrlVar ? decrypt(rpcUrlVar.value) : undefined;

            // Update provider if custom RPC URL provided
            if (rpcUrl) {
                this.provider = new ethers.JsonRpcProvider(rpcUrl);
            }

            // Initialize wallet
            this.wallet = new ethers.Wallet(privateKey, this.provider);

            // Validate wallet has funds
            const balance = await this.provider.getBalance(this.wallet.address);
            if (balance === 0n) {
                return {
                    success: false,
                    error: `Wallet ${this.wallet.address} has no funds. Please add Sepolia ETH from https://sepoliafaucet.com/`
                };
            }

            console.log(`Deployer initialized for user ${userId} with address: ${this.wallet.address}`);
            console.log(`Balance: ${ethers.formatEther(balance)} ETH`);

            return { success: true };
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to initialize deployer';
            console.error('Deployer initialization error:', errorMsg);
            return { success: false, error: errorMsg };
        }
    }

    /**
     * Compile Solidity source code to bytecode and ABI
     */
    compileContract(sourceCode: string, contractName: string = 'GeneratedContract'): CompilationResult {
        try {
            console.log(`Compiling contract: ${contractName}`);

            const input = {
                language: 'Solidity',
                sources: {
                    'contract.sol': {
                        content: sourceCode,
                    },
                },
                settings: {
                    outputSelection: {
                        '*': {
                            '*': ['abi', 'evm.bytecode'],
                        },
                    },
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            };

            const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

            if (output.errors) {
                const errors = output.errors.filter((e: any) => e.severity === 'error');
                if (errors.length > 0) {
                    const errorMsg = errors.map((e: any) => e.formattedMessage).join('\n');
                    console.error('Compilation errors:', errorMsg);
                    return {
                        success: false,
                        error: errorMsg,
                    };
                }
            }

            const contract = output.contracts['contract.sol'][contractName];
            if (!contract) {
                const availableContracts = Object.keys(output.contracts['contract.sol'] || {});
                const errorMsg = `Contract ${contractName} not found. Available: ${availableContracts.join(', ')}`;
                console.error(errorMsg);
                return {
                    success: false,
                    error: errorMsg,
                };
            }

            console.log('Compilation successful');
            return {
                success: true,
                bytecode: contract.evm.bytecode.object,
                abi: contract.abi,
            };
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Compilation failed';
            console.error('Compilation error:', errorMsg);
            return {
                success: false,
                error: errorMsg,
            };
        }
    }

    /**
     * Deploy compiled contract to blockchain
     */
    async deployContract(
        contractCode: string,
        contractName: string = 'GeneratedContract'
    ): Promise<DeploymentResult> {
        try {
            if (!this.wallet) {
                return {
                    success: false,
                    error: 'Wallet not initialized. Please configure your deployment wallet in Settings.',
                };
            }

            console.log('Starting deployment process...');

            // Step 1: Check balance
            const balance = await this.provider.getBalance(this.wallet.address);
            console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);

            if (balance === 0n) {
                return {
                    success: false,
                    error: `Insufficient balance. Wallet ${this.wallet.address} has no funds. Please add Sepolia ETH from https://sepoliafaucet.com/`,
                };
            }

            // Step 2: Compile the contract
            const compilation = this.compileContract(contractCode, contractName);

            if (!compilation.success || !compilation.bytecode || !compilation.abi) {
                return {
                    success: false,
                    error: compilation.error || 'Compilation failed',
                };
            }

            // Step 3: Create contract factory
            const factory = new ethers.ContractFactory(
                compilation.abi,
                compilation.bytecode,
                this.wallet
            );

            // Step 4: Deploy the contract
            console.log('Deploying contract...');
            const contract = await factory.deploy();

            console.log('Waiting for deployment confirmation...');
            await contract.waitForDeployment();
            const address = await contract.getAddress();
            const deploymentTx = contract.deploymentTransaction();

            console.log(`✅ Contract deployed at: ${address}`);
            console.log(`Transaction hash: ${deploymentTx?.hash}`);

            return {
                success: true,
                address: address,
                transactionHash: deploymentTx?.hash,
            };
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Deployment failed';
            console.error('Deployment error:', errorMsg);
            return {
                success: false,
                error: errorMsg,
            };
        }
    }

    async getDeployerAddress(): Promise<string | null> {
        return this.wallet?.address || null;
    }

    async getBalance(): Promise<string> {
        try {
            if (!this.wallet) return '0';
            const balance = await this.provider.getBalance(this.wallet.address);
            return ethers.formatEther(balance);
        } catch (error) {
            console.error('Failed to get balance:', error);
            return '0';
        }
    }
}

// Factory function to create deployer with user credentials
export async function getUserDeployer(userId: string): Promise<ContractDeployer> {
    const deployer = new ContractDeployer();
    const result = await deployer.initializeFromUser(userId);

    if (!result.success) {
        throw new Error(result.error || 'Failed to initialize deployer');
    }

    return deployer;
}

// Legacy function for backward compatibility (deprecated)
export function getDeployer(): ContractDeployer {
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error('DEPLOYER_PRIVATE_KEY not set. Use getUserDeployer() instead.');
    }
    return new ContractDeployer(privateKey);
}
