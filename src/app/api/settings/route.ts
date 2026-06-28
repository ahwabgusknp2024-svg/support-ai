import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextResponse } from "next/server";

export async function POST(req:NextResponse) {
    try{
        const {ownerId,busniessName,supportEmail,knowledge}=await req.json()
        if(!ownerId){
            return NextResponse.json(
                {message:"owner id is required"},
                {status:400}
            )
        }
        await connectDb()
        const settings=await Settings.findOneAndUpdate(
            {ownerId},
            {ownerId,busniessName,supportEmail,knowledge},
            {new:true,upsert:true}
        ) 
        return NextResponse.json(settings)

    }
    catch(error){
        return NextResponse.json(
            {message:`settings error ${error}`},
            {status:400}
        )

    }
    
}
