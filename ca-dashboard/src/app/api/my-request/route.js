import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
const openssl = require('openssl-nodejs');
const fs = require('fs');
import path from 'path';
import connectDB from "@/libs/connectDB";
import SSL from "@/models/SSL";
import {readCsr, SubjectTextToJson} from "@/libs/openssl";

export async function GET(req = NextRequest) {
    const session = await getServerSession(authOptions);
    //FIXME: add isCA check
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    try{
        const sslRequests = await SSL.find({ CA: session.user.id }).sort({ createdAt: -1 });

        const processedRequests = await Promise.all(sslRequests.map(async (request) => {
            const theBuffer = Buffer.from(request.csr);
            let csrDetails = null;

            try {
                const textOutput = await readCsr(theBuffer);
                //console.log(`textOutput: ${textOutput}`);
                csrDetails = SubjectTextToJson(textOutput);
            } catch (error) {
                console.error(`Error processing CSR: ${error}`);
            }

            return {
                id: request._id,
                status: request.status,
                requesterId: request.userId,
                csrDetails: csrDetails ? JSON.parse(csrDetails) : null,
            };
        }));

        return NextResponse.json({ requests: processedRequests }, { status: 200 });
    }
    catch (error){
        console.log(`Error fetching SSL requests:${error}`);
        return NextResponse.json({ error: 'Failed to fetch SSL requests' }, { status: 500 });
    }
    
};

export async function POST(req = NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const filePath = path.join(process.cwd(), 'private', 'testStudent-csr.pem');
    const csrFile = fs.readFileSync(filePath).toString()
    //console.log(csrFile)
    const testEntry = new SSL({
        csr: csrFile,
        userId: session.user.id,  // Associate the SSL request with the user
    })
    await testEntry.save();
    return NextResponse.json({ message: 'SSL request saved successfully' }, { status: 200 });
}