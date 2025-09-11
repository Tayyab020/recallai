const crypto = require('crypto-js');

// Test encryption
const secretKey = process.env.ENCRYPTION_KEY || 'default-secret-key';
const testText = 'This is a test journal entry';

console.log('Testing encryption...');
console.log('Original text:', testText);

try {
    const encrypted = crypto.AES.encrypt(testText, secretKey).toString();
    console.log('Encrypted:', encrypted);

    const decrypted = crypto.AES.decrypt(encrypted, secretKey).toString(crypto.enc.Utf8);
    console.log('Decrypted:', decrypted);

    console.log('Encryption test:', decrypted === testText ? 'PASSED' : 'FAILED');
} catch (error) {
    console.error('Encryption test FAILED:', error);
}