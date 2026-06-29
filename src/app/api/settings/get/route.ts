import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { ownerId } = await req.json();

        if (!ownerId) {
            return NextResponse.json(
                { message: "owner id is required" },
                { status: 400 }
            );
        }

        await connectDb();

        const settings = await Settings.findOne({ ownerId });

        return NextResponse.json(settings);

    } catch (error) {
        return NextResponse.json(
            { message: `getting error ${error}` },
            { status: 500 }
        );
    }
}