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
    ],

    imageUrl:{
        type:String,
        default:null
    }

},
{timestamps:true}
);

export default mongoose.model("Template",templateSchema);