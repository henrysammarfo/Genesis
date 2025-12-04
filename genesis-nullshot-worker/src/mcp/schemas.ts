// MCP Tool Schemas for Genesis
export interface DeployContractInput {
    source_code: string;
    contract_name: string;
    constructor_args?: any[];
}

export interface DeployContractOutput {
    success: boolean;
    address?: string;
    transaction_hash?: string;
    error?: string;
}

export interface VerifySourceInput {
    address: string;
    source_code: string;
    contract_name: string;
    compiler_version: string;
}

export interface VerifySourceOutput {
    success: boolean;
    verification_url?: string;
    error?: string;
}

export interface AnalyzeSecurityInput {
    source_code: string;
}

export interface SecurityIssue {
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    line?: number;
}

export interface AnalyzeSecurityOutput {
    success: boolean;
    issues: SecurityIssue[];
    score: number; // 0-100
}

// MCP Tool Definitions
export const MCP_TOOLS = {
    deploy_contract: {
        name: 'deploy_contract',
        description: 'Deploy a Solidity smart contract to Ethereum Sepolia testnet',
        inputSchema: {
            type: 'object',
            properties: {
                source_code: {
                    type: 'string',
                    description: 'Complete Solidity source code'
                },
                contract_name: {
                    type: 'string',
                    description: 'Name of the contract to deploy'
                },
                constructor_args: {
                    type: 'array',
                    description: 'Optional constructor arguments',
                    items: { type: 'any' }
                }
            },
            required: ['source_code', 'contract_name']
        }
    },

    verify_source: {
        name: 'verify_source',
        description: 'Verify contract source code on Etherscan',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Deployed contract address'
                },
                source_code: {
                    type: 'string',
                    description: 'Solidity source code'
                },
                contract_name: {
                    type: 'string',
                    description: 'Contract name'
                },
                compiler_version: {
                    type: 'string',
                    description: 'Solidity compiler version (e.g., v0.8.20+commit.a1b79de6)'
                }
            },
            required: ['address', 'source_code', 'contract_name', 'compiler_version']
        }
    },

    analyze_security: {
        name: 'analyze_security',
        description: 'Analyze Solidity code for security vulnerabilities using AI',
        inputSchema: {
            type: 'object',
            properties: {
                source_code: {
                    type: 'string',
                    description: 'Solidity source code to analyze'
                }
            },
            required: ['source_code']
        }
    }
};
