import 'dotenv/config';
import { ContractDeployer } from '../src/lib/deployer';
import * as fs from 'fs';
import * as path from 'path';

async function testDeployment() {
    try {
        console.log('=== Testing Contract Deployment ===\n');

        // Read the simple contract
        const contractPath = path.join(__dirname, '../contracts/SimpleStorage.sol');
        const contractCode = fs.readFileSync(contractPath, 'utf8');

        console.log('Contract Code:');
        console.log(contractCode);
        console.log('\n--- Starting Deployment ---\n');

        // Get deployer info
        const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('DEPLOYER_PRIVATE_KEY not found in environment');
        }
        const deployer = new ContractDeployer(privateKey);
        const deployerAddress = await deployer.getDeployerAddress();
        const balance = await deployer.getBalance();

        console.log('Deployer Address:', deployerAddress);
        console.log('Balance:', balance, 'ETH');

        if (parseFloat(balance) === 0) {
            console.error('\n❌ ERROR: Wallet has 0 ETH. Please fund the wallet with Sepolia ETH.');
            console.log('Get Sepolia ETH from: https://sepoliafaucet.com/');
            process.exit(1);
        }

        console.log('\n--- Deploying Contract ---\n');

        // Deploy the contract
        const result = await deployer.deployContract(contractCode, 'SimpleStorage');

        if (result.success) {
            console.log('\n✅ Deployment Successful!');
            console.log('Contract Address:', result.address);
            console.log('Transaction Hash:', result.transactionHash);
            console.log('\nView on Etherscan:');
            console.log(`https://sepolia.etherscan.io/address/${result.address}`);
            console.log(`https://sepolia.etherscan.io/tx/${result.transactionHash}`);
        } else {
            console.log('\n❌ Deployment Failed');
            console.log('Error:', result.error);
        }

        return result;
    } catch (error) {
        console.error('\n❌ Test Failed:', error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    testDeployment()
        .then(() => {
            console.log('\n=== Test Complete ===');
            process.exit(0);
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

export { testDeployment };
