import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
const openssl = require('openssl-nodejs');
import connectDB from "@/libs/connectDB";
import SSL from "@/models/User";

export async function GET(req = NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({error: 'Unauthorised'}, {status: 401});
    }
    return NextResponse.json({}, {status: 200});
};