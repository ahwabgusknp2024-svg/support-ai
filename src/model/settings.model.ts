import mongoose ,{ model,Schema } from "mongoose";
import { unique } from "next/dist/build/utils";
interface ISettings{
    ownerId:string
    busniessName:string
    supportEmail:string
    knowledge:string
}

const settingsSchema=new Schema<ISettings>({
    ownerId:{
        type:String,
        required:true,
        unique:true
    },
    busniessName:{
        type:String,
        
    },
    supportEmail:{
        type:String,
        
    },
    knowledge:{
        type:String,
        
    }            
},{timestamps:true})
const Settings=mongoose.models.Settings || model("Settings",settingsSchema)
export default Settings