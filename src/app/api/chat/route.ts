import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try{
        const {message,ownerId}=await req.json()
        if(!message|| !ownerId){
            return NextResponse.json(
                {message:"message and owner id is required"},
                {status:400}
            )
        }
        await connectDb()
        const setting=await Settings.findOne({ownerId})
        if(!setting){
            return NextResponse.json(
                { message:"chat bot is not configured yet."},
                {status:400}
            )
        }
        const KNOWLEDGE=`
        busniess name-${setting.busniessName || "not provided"}
        support email-${setting.supportEmail || "not provided"}
        knowledge-${setting.knowledge || "not provided"}
        `

    const prompt = `
You are a helpful, professional, and friendly Customer Support Assistant for ${setting.businessName || 'Gada Electronics'}.

Your goal is to provide accurate information based ONLY on the provided Business Information.

RULES:
1. Use the provided information to answer questions. 
2. If you are not sure or the information is not provided, politely explain that you don't have that specific information and suggest they contact support at ${setting.supportEmail || 'our support email'}.
3. Keep answers concise, helpful, and professional.
4. Do not invent policies, prices, or services.

----------------------
BUSINESS INFORMATION
---------------------
${KNOWLEDGE}

---------------------
CUSTOMER QUESTION
---------------------
${message}

--------------------
YOUR RESPONSE:
`;
    const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
    const res=await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:prompt,

    });
    const respose= NextResponse.json(res.text)
    respose.headers.set("Access-Control-Allow-Origin","*");
    respose.headers.set("Access-Control-Allow-Methods","POST , OPTIONS");
    respose.headers.set("Access-Control-Allow-Headers","Content-Type");
    return respose
    }
    catch(error){
        const respose= NextResponse.json(
            {message:`chat error ${error}`},
            {status:500}
        )
        
    respose.headers.set("Access-Control-Allow-Origin","*");
    respose.headers.set("Access-Control-Allow-Methods","POST , OPTIONS");
    respose.headers.set("Access-Control-Allow-Headers","Content-Type");
    return respose

    }
    
}

export const OPTIONS = async () => {
  return NextResponse.json(null, {
    status: 201, // Changed from 201 to 200 (standard for OPTIONS)
    headers: {
      "Access-Control-Allow-Origin": "*", // Fixed typo here
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};