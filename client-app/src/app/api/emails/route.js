import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import connectDB from "@/libs/connectDB";
import Email from "@/models/Email";
import User from "@/models/User";
import { getNFTs } from "@/libs/rippled";
import {ipfsBlockGet} from "@/libs/ipfs.js";
import { decryptFileWithHashedEmail } from "@/libs/hash";

export async function GET(req = NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userEmail = user.email;
    console.log(userEmail);
    const emails = await Email.find({ to: userEmail }).sort({ createdAt: -1 });
    console.log(emails);
    return NextResponse.json({ emails }, { status: 200 });
}

export async function POST(req = NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const formData = await req.formData();
    const recipient = formData.get('recipient');
    const subject = formData.get('subject');
    const body = formData.get('body');

    // encrypt body
    const nfts = await getNFTs(recipient);
    const nftJson = JSON.parse(nfts);
    
    const genesisNft = nftJson.result.account_nfts.filter((nft) => {
        return nft.Issuer == process.env.XRPL_GENESIS_ADDRESS
    });
    const ipfsURI = Buffer.from(genesisNft[genesisNft.length-1].URI, 'hex').toString();
    console.log(ipfsURI);

    const getRes = await ipfsBlockGet(ipfsURI);
    // ignore ipfs padding
    console.log(typeof getRes);
    const content = getRes.subarray(8, getRes.length-3);
    console.log(content);

    const decryptedCert = decryptFileWithHashedEmail(content, recipient);
    console.log(decryptedCert.toString());

    // encrypt body
    

    const newEmail = new Email({
        from: session.user.id,
        to: recipient,
        subject: subject,
        text: body
    });
    await newEmail.save();
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
}
