const fs = require('fs');

const ipfsCat = async (cid) => {
    const url = `http://${process.env.IPFS_HOST}:${process.env.IPFS_PORT}/api/v0/cat?arg=${cid}`;

    try{
        const response = await fetch(url, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`Failed to retrieve file: ${response.statusText}`);
        }

        const fileContent = await response.text(); // Get the file content as text
        //console.log(`File retrieved from IPFS: ${fileContent}`);
        return fileContent;
    }
    catch(err){
        console.error(`Error cat from IPFS: ${err}`);
        return null;
    }
}

const ipfsGet = async (cid, outputPath) => {
    const url = `http://${process.env.IPFS_HOST}:${process.env.IPFS_PORT}/api/v0/block/get?arg=${cid}&output=${outputPath}`;
    try{
        const response = await fetch(url, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`Failed to retrieve block: ${response.statusText}`);
        }
        console.log(response);
        
        //const blockContent = await response.body; // Get the block content as text
        //console.log(`Block retrieved from IPFS: ${blockContent}`);
        return response;
    }
    catch(err){
        console.error(`Error getting block from IPFS: ${err}`);
        return null;
    }
}

const ipfsBlockGet = async (cid) => {
    const url = `http://${process.env.IPFS_HOST}:${process.env.IPFS_PORT}/api/v0/block/get?arg=${cid}`;
    try{
        const response = await fetch(url, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`Failed to retrieve block: ${response.statusText}`);
        }
        console.log(response);
        const stream = await response.arrayBuffer();
        const buffer = Buffer.from(stream);
        return buffer;
    }
    catch(err){
        console.error(`Error getting block from IPFS: ${err}`);
        return null;
    }
}

const ipfsAdd = async (fileBuffer, fileName) => {
    const url = `http://${process.env.IPFS_HOST}:${process.env.IPFS_PORT}/api/v0/add`;
    const formData = new FormData();
    try{
        formData.append('file', new Blob([fileBuffer]), fileName);
    }
    catch(err){
        console.log(err);
        return null;
    }
    try{
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to add file: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data.Hash);
        return data.Hash;
    }
    catch(err){
        console.error(`Error Adding to IPFS: ${err}`);
        return null;
    }
}

// fileName is the name on the ipfs
const ipfsAddFromFilePath = async (filePath, fileName) => {
    try{
        const fileBuffer = fs.readFileSync(filePath);
        formData.append('file', new Blob([fileBuffer]), fileName);
    }
    catch(err){
        console.log(err);
        return null;
    }
    try{
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to add file: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data.Hash);
        return data.Hash;
    }
    catch(err){
        console.error(`Error Adding to IPFS: ${err}`);
        return null;
    }
};

export { ipfsAdd, ipfsCat, ipfsGet, ipfsBlockGet, ipfsAddFromFilePath };