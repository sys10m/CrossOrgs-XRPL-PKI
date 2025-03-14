const fs = require('fs');
const openssl = require('openssl-nodejs');

import path from 'path';


const SubjectTextToJson = (textResponse) => {
    //console.log(textResponse);
    const text = textResponse;
    // Regex to extract the "Subject" line
    const subjectRegex = /Subject:\s*([^,\n]+=[^,\n]+(?:,\s*[^,\n]+=[^,\n]+)*)/;
    if (!textResponse){
        return "no text is passed";
    }
    const match = text.match(subjectRegex);
    
    if (match) {
        const subjectString = match[1];

        // Convert to JSON
        const subjectJSON = subjectString.split(', ').reduce((acc, pair) => {
            const [key, value] = pair.split('=');
            acc[key.trim()] = value.trim();
            return acc;
        }, {});

        //console.log(JSON.stringify(subjectJSON, null, 2));
        return JSON.stringify(subjectJSON);
    } else {
        console.log('Subject data not found.');
        return "";
    }
}

const readCsr = (theBuffer) => {
    return new Promise((resolve, reject) => {
        // Create a temporary file with a unique name in the system's temp directory
        const fileName = `csr-${Date.now()}.pem`
        const tempFile = path.join(`openssl/${fileName}`);

        try {
            // Write the buffer to the temporary file
            fs.writeFileSync(tempFile, theBuffer);
            // Use the temporary file path with openssl
            openssl(['req', '-in', fileName, '-text', '-noout'], (err, buffer) => {
                // Clean up the temporary file
                try {
                    fs.unlinkSync(tempFile);
                } catch (cleanupError) {
                    console.error('Error cleaning up temp file:', cleanupError);
                }
                
                if (err.toString()) {
                    console.error('OpenSSL error:', err.toString());
                    reject(err.toString());
                } else {
                    console.log("OpenSSL passed");
                    resolve(buffer.toString());
                }
            });
        } catch (error) {
            // Clean up if there was an error
            try {
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                }
            } catch (cleanupError) {
                console.error('Error cleaning up temp file:', cleanupError);
            }
            reject(error.toString());
        }
    });
};

const EncryptMessageByCert = async (message, cert) => {
    const tempMessageFile = `message-${Date.now()}.txt`;
    const tempEncryptedFile = `encrypted-${Date.now()}.txt`;

    fs.writeFileSync(`openssl/${tempMessageFile}`, message);
    fs.writeFileSync(`openssl/${tempEncryptedFile}`, '');

    return new Promise((resolve, reject) => {
        openssl(['smime', '-encrypt', '-aes256', '-in', tempMessageFile, '-out', tempEncryptedFile, { name: 'cert.pem', buffer: Buffer.from(cert) }], (err, buffer) => {
            if (err.toString()) {
                console.error('OpenSSL error:', err.toString());
                reject(err.toString());
                return;
            }

            console.log(`OpenSSL passed: ${buffer.toString()}`);
            const encryptedMessage = fs.readFileSync(`openssl/${tempEncryptedFile}`);
            fs.unlinkSync(`openssl/${tempEncryptedFile}`);
            fs.unlinkSync(`openssl/${tempMessageFile}`);
            console.log(encryptedMessage.toString());
            resolve(encryptedMessage.toString());
        });
    });
}

const DecryptMessageByKey = async (encryptedMessage, keyPath) => {
    const tempMessageFile = `message-${Date.now()}.txt`;
    const tempEncryptedFile = `encrypted-${Date.now()}.txt`;

    fs.writeFileSync(`openssl/${tempMessageFile}`, '');
    fs.writeFileSync(`openssl/${tempEncryptedFile}`, encryptedMessage);
    return new Promise((resolve, reject) => {
        // FIX: prompt user for password
        openssl(['smime', '-decrypt', '-in', tempEncryptedFile, '-out', tempMessageFile, '-inkey', keyPath, '-passin', 'pass:whatever'], (err, buffer) => {
            if (err.toString()) {
                console.error('OpenSSL error:', err.toString());
                reject(err.toString());
                return;
            }

            console.log(`OpenSSL passed: ${buffer.toString()}`);
            const decryptedMessage = fs.readFileSync(`openssl/${tempMessageFile}`);
            fs.unlinkSync(`openssl/${tempEncryptedFile}`);
            fs.unlinkSync(`openssl/${tempMessageFile}`);
            console.log(decryptedMessage.toString());
            resolve(decryptedMessage.toString());
        });
    });
}

export { SubjectTextToJson, readCsr, EncryptMessageByCert, DecryptMessageByKey };