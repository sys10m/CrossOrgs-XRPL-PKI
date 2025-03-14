import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import connectDB from "@/libs/connectDB";
import Email from "@/models/Email";
import User from "@/models/User";
import { DecryptMessageByKey } from "@/libs/openssl";

export async function POST(req = NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const formData = await req.formData();
    const encryptedMessage = formData.get("encryptedMessage");
    console.log(encryptedMessage);
    const decryptedMessage = await DecryptMessageByKey(encryptedMessage, "key.pem");
    console.log(decryptedMessage);
    return NextResponse.json({ decryptedMessage }, { status: 200 });
}