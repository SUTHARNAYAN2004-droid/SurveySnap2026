import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema(
{
    survey:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Survey"
    },

    email:{
        type:String
    },

    status:{
        type:String,
        enum:["sent","failed"]
    }

},
{timestamps:true}
);

export default mongoose.model("EmailLog",emailLogSchema);