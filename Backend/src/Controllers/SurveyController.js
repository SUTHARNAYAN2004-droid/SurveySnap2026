const Survey = require("../Models/Survey");
const Response = require("../Models/Response");
const mailSend = require("../Utils/MailUtil");

exports.getAllSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find().populate("creator", "firstName lastName email");
        res.status(200).json(surveys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createSurvey = async (req, res) => {
    try {
        const { title, description, creator, isPublic, status, questions } = req.body;
        const newSurvey = new Survey({ title, description, creator, isPublic, status, questions });
        const savedSurvey = await newSurvey.save();
        res.status(201).json(savedSurvey);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Public link ke liye - no auth required
exports.getSurveyById = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);
        if (!survey) return res.status(404).json({ message: "Survey not found" });
        res.status(200).json(survey);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Response submit + optional confirmation email
exports.submitResponse = async (req, res) => {
    try {
        const { surveyId, respondentEmail, answers } = req.body;
        const newResponse = new Response({ survey: surveyId, respondentEmail, answers });
        await newResponse.save();

        // Confirmation email bhejo agar email diya ho
        if (respondentEmail) {
            try {
                await mailSend(
                    respondentEmail,
                    "Survey Response Submitted - SurveySnap",
                    `Thank you for submitting your response!\n\nYour response has been recorded successfully.\n\n- SurveySnap Team`
                );
            } catch (mailErr) {
                console.error("Email failed:", mailErr.message);
            }
        }

        res.status(201).json({ message: "Response submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Survey analytics - responses ka breakdown per question
exports.getSurveyAnalytics = async (req, res) => {
    try {
        const { id } = req.params;
        const survey = await Survey.findById(id);
        if (!survey) return res.status(404).json({ message: "Survey not found" });

        const responses = await Response.find({ survey: id });

        // Har question ke liye answer counts banao
        const analytics = survey.questions.map((q, index) => {
            const counts = {};
            responses.forEach(r => {
                const ans = r.answers.find(a => a.questionIndex === index);
                if (ans?.answer) {
                    counts[ans.answer] = (counts[ans.answer] || 0) + 1;
                }
            });
            return {
                questionIndex: index,
                questionText: q.text,
                questionType: q.type,
                totalAnswers: responses.filter(r => r.answers.find(a => a.questionIndex === index)).length,
                data: Object.entries(counts).map(([name, value]) => ({ name, value }))
            };
        });

        res.status(200).json({
            survey: { title: survey.title, description: survey.description },
            totalResponses: responses.length,
            analytics
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Survey status toggle - active/closed
exports.toggleSurveyStatus = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);
        if (!survey) return res.status(404).json({ message: "Survey not found" });
        survey.status = survey.status === "active" ? "closed" : "active";
        await survey.save();
        res.status(200).json({ message: "Status updated", status: survey.status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Creator ke surveys fetch karo
exports.getSurveysByCreator = async (req, res) => {
    try {
        const surveys = await Survey.find({ creator: req.params.creatorId });
        res.status(200).json(surveys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Survey link email se share karo
exports.shareSurveyByEmail = async (req, res) => {
    try {
        const { email, surveyLink, surveyTitle } = req.body;
        await mailSend(
            email,
            `You're invited to take a survey: ${surveyTitle}`,
            `Hello!\n\nYou have been invited to fill out a survey: "${surveyTitle}"\n\nClick the link below to take the survey:\n${surveyLink}\n\n- SurveySnap Team`
        );
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Share email error:", error.message);
        res.status(500).json({ message: "Failed to send email" });
    }
};

exports.deleteSurvey = async (req, res) => {
    try {
        await Survey.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
