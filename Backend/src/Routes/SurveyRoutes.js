const express = require("express");
const router = express.Router();
const c = require("../Controllers/SurveyController");

router.get("/all", c.getAllSurveys);
router.post("/create", c.createSurvey);
router.post("/response", c.submitResponse);                    // response pehle - /:id se conflict na ho
router.get("/creator/:creatorId", c.getSurveysByCreator);      // creator ke surveys
router.get("/:id/analytics", c.getSurveyAnalytics);            // analytics
router.put("/:id/toggle-status", c.toggleSurveyStatus);        // active/closed toggle
router.post("/share-email", c.shareSurveyByEmail);             // email se survey share
router.get("/:id", c.getSurveyById);                           // public survey
router.delete("/:id", c.deleteSurvey);

module.exports = router;
