import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    category:{
        type:String
    },

    questions:[
        {
            questionText:String,
            questionType:String,
            options:[String]
        }
    ]

},
{timestamps:true}
);

export default mongoose.model("Template",templateSchema);