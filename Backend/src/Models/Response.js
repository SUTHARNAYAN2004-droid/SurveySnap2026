const mongoose = require("mongoose");

// Response model - survey ka ID aur answers store karta hai
// respondentEmail optional hai (anonymous bhi ho sakta hai)
const responseSchema = new mongoose.Schema({
    survey: { type: mongoose.Schema.Types.ObjectId, ref: "Survey", required: true },
    respondentEmail: { type: String, default: "" },
    answers: [
        {
            questionIndex: Number,  // question ka index
            answer: String          // selected/typed answer
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Response", responseSchema);
