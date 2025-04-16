const express = require("express");
const router = express.Router();
const addcontroller = require('../../controllers/note-details/addnotedetails');
const fetchnotesController = require('../../controllers/note-details/fetchnote-details')

router.post('/addnew-notedetails', addcontroller.addNewNoteDetails);
router.post('/fetchnote-details', fetchnotesController.fetchNotes)

module.exports = router;