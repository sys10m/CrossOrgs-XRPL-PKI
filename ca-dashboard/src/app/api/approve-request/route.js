import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import connectDB from "@/libs/connectDB";
const openssl = require('openssl-nodejs');

const fs = require('fs');
import SSL from "@/models/SSL";
import User from "@/models/User";
import { ipfsAdd, ipfsCat, ipfsGet, ipfsBlockGet, ipfsAddFromFilePath } from '@/libs/ipfs.js';
import { encryptFileWithHashedEmail, decryptFileWithHashedEmail, generateXRPLAccountFromString } from '@/libs/hash.js';
import { readCsr, SubjectTextToJson } from '@/libs/openssl.js';
import { CAmintFor } from '@/libs/rippled.js';

export async function GET(req = NextRequest) {

    const fileContent = fs.readFileSync('openssl/testStudent-csr.pem');
    const encrypted = encryptFileWithHashedEmail(fileContent, 'hiranayp@tcd.ie')
    const encryptedBuffer = Buffer.from(encrypted);
    console.log(typeof encrypted);
    const cid = await ipfsAdd(encryptedBuffer, 'testStudent-csr.pem');
    console.log(cid);

    /*
    const getRes = await ipfsBlockGet(cid);
    console.log(getRes.subarray(getRes.length-10));
    const content = getRes.subarray(8, getRes.length-3);
    console.log(content);
    console.log("try decrypt");
    //const contentBuffer = Buffer.isBuffer(content) ? content : Buffer.from(content, 'binary');

    console.log("Buffers are equal:", Buffer.compare(content, encryptedBuffer) === 0);
    
    console.log(encryptedBuffer.subarray(encryptedBuffer.length - 10));

    const decrypted = decryptFileWithHashedEmail(content, 'hiranayp@tcd.ie');
    console.log(decrypted.toString());
    */
    /*
     const cid = 'QmUwLiXJFbbXwcJmiMZpLrwCp9kcNqJGzAMthBDTDwm5zn';
     const getRes = await ipfsBlockGet(cid);
     console.log(getRes.subarray(getRes.length-10));
     const content = getRes.subarray(8, getRes.length-3);
     console.log(content);
     console.log("try decrypt");
     const decrypted = decryptFileWithHashedEmail(content, 'hollandt@tcd.ie');
     console.log(decrypted.toString());
     */
    return NextResponse.json({ cid });
}

export async function POST(req = NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();

    const formData = await req.formData();
    const id = formData.get('id');

    try {
        const sslRequest = await SSL.findById(id);
        if (!sslRequest) {
            return NextResponse.json({ error: 'SSL request not found' }, { status: 404 });
        }
        if (sslRequest.status !== 'pending') {
            return NextResponse.json({ error: 'SSL request is not pending' }, { status: 400 });
        }
        if (sslRequest.CA != session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const fileName = `ssl-${sslRequest._id}.pem`;
        const tempFile = `openssl/${fileName}`;
        const csrBuffer = Buffer.from(sslRequest.csr);
        const csrText = await readCsr(csrBuffer);

        const csrjson = JSON.parse(SubjectTextToJson(csrText));

        fs.writeFileSync(tempFile, csrBuffer);
        const outFileName = "tempCert.pem";
        fs.writeFileSync(`openssl/${outFileName}`, '');
        await new Promise((resolve, reject) => {
            openssl(['x509', '-req', '-in', fileName, '-out', outFileName, '-CA', process.env.MY_CERT_PATH, '-CAkey', process.env.MY_KEY_PATH, '-days', '365', '-passin', `pass:${process.env.MY_KEY_PASS}`], async (buffer, err) => {
                if (err.toString()) {
                    console.log(`Error generating certificate: ${err.toString()}`);
                    return reject(new Error('Failed to generate certificate'));
                }
                console.log(`read file from: ${outFileName}`);
                console.log(`file size ${fs.statSync(`openssl/${outFileName}`).size}`);
                const certContent = fs.readFileSync(`openssl/${outFileName}`);

                const encrypted = encryptFileWithHashedEmail(certContent, csrjson.emailAddress);
                const encryptedBuffer = Buffer.from(encrypted);
                console.log(encryptedBuffer);
                console.log(decryptFileWithHashedEmail(encryptedBuffer, csrjson.emailAddress));
                const cid = await ipfsAdd(encryptedBuffer, 'cert.pem');

                console.log(cid);

                console.log("Mint NFT to Email");
                await CAmintFor(csrjson.emailAddress, cid);

                // update database
                //sslRequest.status = 'approved';
                //await sslRequest.save();

                // clean up
                try {
                    fs.unlinkSync(tempFile);
                    fs.unlinkSync(`openssl/${outFileName}`);
                }
                catch (error) {
                    console.log(`Error cleaning up:${error}`);
                }
                resolve();

            });
        });
        return NextResponse.json({ message: 'SSL request approved successfully' }, { status: 200 });
        // xrpl

    }
    catch (error) {
        console.log(`Error approving SSL request:${error}`);
        return NextResponse.json({ error: 'Failed to approve SSL request' }, { status: 500 });
    }

}