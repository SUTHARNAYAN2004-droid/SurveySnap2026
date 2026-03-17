const express = require('express');
const router = express.Router();

// Define your routes here
router.get('/', (req, res) => {
    res.send('Email Log Route is working!');
});

// THIS IS THE MOST IMPORTANT PART:
module.exports = router;