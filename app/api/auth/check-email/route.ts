import { NextRequest, NextResponse } from "next/server";
import { checkEmailExists } from "@/lib/authUtils";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const exists = await checkEmailExists(email);

        return NextResponse.json({
            exists,
            message: exists ? "Account exists" : "Account doesn't exist"
        });
    } catch (error) {
        console.error("Error checking email:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
