import { ethers } from 'ethers';

async function checkWallet() {
    try {
        // Use public Sepolia RPC
        const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');

        // Get wallet address from env
        const address = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || '0x2f914bcbad5bf4967bbb11e4372200b7c7594aeb';

        console.log('Connecting to Sepolia...');

        // Get balance
        const balance = await provider.getBalance(address);
        const balanceInEth = ethers.formatEther(balance);

        console.log('\n=== Sepolia Wallet Info ===');
        console.log('Address:', address);
        console.log('Balance:', balanceInEth, 'ETH');
        console.log('Balance (Wei):', balance.toString());

        if (balance === 0n) {
            console.log('\n⚠️  WARNING: Wallet has 0 ETH!');
            console.log('Get Sepolia ETH from: https://sepoliafaucet.com/');
            console.log('Or: https://www.alchemy.com/faucets/ethereum-sepolia');
        }

        // Get network
        const network = await provider.getNetwork();
        console.log('\nNetwork:', network.name);
        console.log('Chain ID:', network.chainId.toString());

        // Get latest block
        const blockNumber = await provider.getBlockNumber();
        console.log('Latest Block:', blockNumber);

        return {
            address,
            balance: balanceInEth,
            network: network.name,
            chainId: network.chainId.toString(),
            blockNumber,
        };
    } catch (error) {
        console.error('\n❌ Error checking wallet:', error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    checkWallet()
        .then(() => {
            console.log('\n=== Check Complete ===');
            process.exit(0);
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

export { checkWallet };
