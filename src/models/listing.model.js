import mongoose,{ Schema } from "mongoose";


// fields req::
/* 
    listingName: Str,
    description:Str,
    rent:num,
    address:{area,city},
    tags :[],
    postedby:mongoose User,
    isAvailable:bool,
    coverImage:Str,
    // referenceImages:[]
    
*/


const listingSchema = new Schema({
    listingName:String,
    description:String,
    rent:Number,
    address:{
        area: String,
        city: {
            type:String,
            default:"delhi"
        },
    },
    houseRules: [String],
    ownerName: {
        type:String
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    phoneNumber:{
        type:String
    },
    coverImage:{
        type:String,
    },

},{timestamps:true})

export const Listing = mongoose.model("Listing",listingSchema)