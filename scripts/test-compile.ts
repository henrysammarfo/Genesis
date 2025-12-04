import solc from 'solc';

const simpleContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 public value;
    
    event ValueChanged(uint256 newValue);
    
    function setValue(uint256 _value) public {
        value = _value;
        emit ValueChanged(_value);
    }
    
    function getValue() public view returns (uint256) {
        return value;
    }
}`;

function testCompilation() {
    console.log('=== Testing Solidity Compilation ===\n');
    console.log('Contract Code:');
    console.log(simpleContract);
    console.log('\n--- Compiling ---\n');

    try {
        const input = {
            language: 'Solidity',
            sources: {
                'contract.sol': {
                    content: simpleContract,
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

        const output = JSON.parse(solc.compile(JSON.stringify(input)));

        if (output.errors) {
            console.log('Compilation warnings/errors:');
            output.errors.forEach((error: any) => {
                console.log(`[${error.severity}] ${error.formattedMessage}`);
            });
        }

        const contract = output.contracts['contract.sol']['SimpleStorage'];

        if (contract) {
            console.log('\n✅ Compilation Successful!');
            console.log('\nBytecode length:', contract.evm.bytecode.object.length);
            console.log('ABI functions:', contract.abi.length);
            console.log('\nABI:');
            console.log(JSON.stringify(contract.abi, null, 2));
            return true;
        } else {
            console.log('\n❌ Contract not found in output');
            return false;
        }
    } catch (error) {
        console.error('\n❌ Compilation failed:', error);
        return false;
    }
}

if (require.main === module) {
    const success = testCompilation();
    process.exit(success ? 0 : 1);
}

export { testCompilation };
