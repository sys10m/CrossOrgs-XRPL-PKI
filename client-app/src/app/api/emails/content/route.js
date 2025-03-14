import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { getEmailContent } from "@/libs/email";

export async function POST(req = NextRequest) {
    const formData = await req.formData();
    const uid = formData.get("uid");

    const emailContent = await getEmailContent(uid);
    return NextResponse.json({ emailContent }, { status: 200 });
}