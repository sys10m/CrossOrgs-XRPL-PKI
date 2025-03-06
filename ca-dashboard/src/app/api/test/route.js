import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import connectDB from "@/libs/connectDB";
import SSL from "@/models/SSL";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";

export async function GET() {
    try {
        // Connect to database
        await connectDB();

        // Get current user from session
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Read the CSR file
        const csrPath = path.join('openssl', 'testStudent-csr.pem');
        const csrContent = fs.readFileSync(csrPath, 'utf8');

        // Create new SSL request
        const sslRequest = await SSL.create({
            csr: csrContent,
            userId: session.user.id,
            status: 'pending',
            CA: '67b787de0f7134504861a50d', // Hardcoded CA ID
        });

        return NextResponse.json({ 
            message: "CSR uploaded successfully",
            request: sslRequest 
        });

    } catch (error) {
        console.error('Error uploading CSR:', error);
        return NextResponse.json({ 
            error: "Failed to upload CSR",
            details: error.message 
        }, { 
            status: 500 
        });
    }
}