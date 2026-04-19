const mongoose = require("mongoose");

// Survey model - questions directly embed kiye hain (alag Questions collection nahi)
const surveySchema = new mongoose.Schema({
    title: String,
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPublic: { type: Boolean, default: true },
    status: { type: String, default: "active" },
    questions: [
        {
            text: String,
            type: { type: String, enum: ["multiple_choice", "rating", "yes_no", "text"] },
            options: [String]
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Survey", surveySchema);
