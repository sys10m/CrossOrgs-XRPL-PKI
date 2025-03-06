const xrpl = require('xrpl');
const crypto = require('crypto');

const hashStringToEntropy = (inputString) => {
    const hash = crypto.createHash('sha512');
    hash.update(inputString);
    const entropy = hash.digest('hex').substring(0,31);
    return entropy;
};

const generateXRPLAccountFromString = (inputString) => {
    const wallet = xrpl.Wallet.fromEntropy(hashStringToEntropy(inputString));
    console.log(wallet);
    return wallet;
};

const encryptFileWithHashedEmail = (fileBuffer, email) => {
    const key = crypto.createHash('sha256').update(email).digest();
    const iv = Buffer.from(process.env.FIXED_IV, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
    return encrypted;
};

const decryptFileWithHashedEmail = (encryptedBuffer, email) => {
    const key = crypto.createHash('sha256').update(email).digest();
    const iv = Buffer.from(process.env.FIXED_IV, 'hex');
    const cipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    const decrypted = Buffer.concat([cipher.update(encryptedBuffer), cipher.final()]);
    return decrypted;
};


const test = () => {
    generateXRPLAccountFromString('hello world');
};

export {encryptFileWithHashedEmail, decryptFileWithHashedEmail, generateXRPLAccountFromString, test};