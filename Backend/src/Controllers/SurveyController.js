const Survey = require("../Models/Survey");

// Get All Surveys
exports.getAllSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find().populate("creator", "name email");
        res.status(200).json(surveys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Survey
exports.createSurvey = async (req, res) => {
    try {
        const { title, description, creator, isPublic, status } = req.body;

        const newSurvey = new Survey({
            title,
            description,
            creator,
            isPublic,
            status
        });

        const savedSurvey = await newSurvey.save();
        res.status(201).json(savedSurvey);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Survey
exports.deleteSurvey = async (req, res) => {
    try {
        await Survey.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};