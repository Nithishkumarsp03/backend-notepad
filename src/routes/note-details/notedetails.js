const express = require("express");
const router = express.Router();
const addcontroller = require('../../controllers/note-details/addnotedetails')

router.post('/addnew-notedetails', addcontroller.addNewNoteDetails);

module.exports = router;