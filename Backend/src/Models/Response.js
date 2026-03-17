import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
{
    survey:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Survey"
    },

    respondentEmail:{
        type:String
    },

    answers:[
        {
            question:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Question"
            },

            answer:{
                type:String
            }
        }
    ]

},
{timestamps:true}
);

export default mongoose.model("Response",responseSchema);