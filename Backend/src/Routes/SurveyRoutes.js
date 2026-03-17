const express = require("express");
const router = express.Router();
const surveyController = require("../Controllers/SurveyController");

router.get("/all", surveyController.getAllSurveys);
router.post("/create", surveyController.createSurvey);
router.delete("/:id", surveyController.deleteSurvey);

module.exports = router;