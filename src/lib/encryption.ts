import crypto from 'crypto';

// Get encryption key from environment
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32chars!!';

// Ensure key is 32 bytes for AES-256
const KEY = Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));

/**
 * Encrypts a string using AES-256-CBC
 * @param text - The text to encrypt
 * @returns Encrypted text in format: iv:encryptedData
 */
export function encrypt(text: string): string {
    try {
        // Generate a random initialization vector
        const iv = crypto.randomBytes(16);

        // Create cipher
        const cipher = crypto.createCipheriv('aes-256-cbc', KEY, iv);

        // Encrypt the text
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Return IV and encrypted data separated by ':'
        return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypts a string encrypted with the encrypt function
 * @param encryptedText - The encrypted text in format: iv:encryptedData
 * @returns Decrypted text
 */
export function decrypt(encryptedText: string): string {
    try {
        // Split IV and encrypted data
        const parts = encryptedText.split(':');
        if (parts.length !== 2) {
            throw new Error('Invalid encrypted text format');
        }

        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];

        // Create decipher
        const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, iv);

        // Decrypt the text
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}

/**
 * Hashes a string using SHA-256
 * @param text - The text to hash
 * @returns Hashed text in hex format
 */
export function hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Generates a random string for use as API keys, tokens, etc.
 * @param length - Length of the random string (default: 32)
 * @returns Random hex string
 */
export function generateRandomString(length: number = 32): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}
