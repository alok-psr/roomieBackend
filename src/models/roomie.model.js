import mongoose,{Schema} from "mongoose";

const roomieSchema = new Schema({

    avatar:String,
    name:String,
    age:Number,
    profession:String,
    description:String,
    location : {
        area:String,
        city:String
    },
    qualities:[String],
    dealBrakers:[String]


})

export const Roomie = mongoose.model("Roomie",roomieSchema) 