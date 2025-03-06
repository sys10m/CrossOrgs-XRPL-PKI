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

export { SubjectTextToJson, readCsr };