const express = require("express");
const router = express.Router();
const shareNotes = require('../../controllers/others/sharenotes');

router.post('/share', shareNotes.shareNotes);

module.exports = router;