const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
    title: String,
    description: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isPublic: Boolean,
    status: String
}, { timestamps: true });

module.exports = mongoose.model("Survey", surveySchema);