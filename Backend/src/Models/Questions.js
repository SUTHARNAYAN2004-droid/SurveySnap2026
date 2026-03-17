import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
{
    survey:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Survey"
    },

    questionText:{
        type:String,
        required:true
    },

    questionType:{
        type:String,
        enum:["multiple","text","rating","dropdown","longtext"],
        required:true
    },

    options:[
        {
            type:String
        }
    ],

    required:{
        type:Boolean,
        default:false
    }

},
{timestamps:true}
);

export default mongoose.model("Question",questionSchema);