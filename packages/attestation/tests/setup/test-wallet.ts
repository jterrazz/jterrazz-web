import { type LocalAccount, privateKeyToAccount } from 'viem/accounts';

/**
 * Hardhat default mnemonic, account[0]. Used for all signing tests in this package.
 *
 * NEVER use this key for anything that holds value. It is the most public
 * private key in the Ethereum ecosystem.
 *
 *   mnemonic: test test test test test test test test test test test junk
 *   address:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
 */
export const TEST_PRIVATE_KEY =
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as const;

export const TEST_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as const;

export function testAccount(): LocalAccount {
    return privateKeyToAccount(TEST_PRIVATE_KEY);
}
