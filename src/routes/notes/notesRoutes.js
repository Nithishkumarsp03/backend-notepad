const express = require("express");
const router = express.Router();
const addController = require('../../controllers/notes/newNote');
const fetchnotesController = require('../../controllers/notes/fetchNotes');

router.post('/addnote', addController.addnewnote);
router.post('/fetchnotes', fetchnotesController.fetchNotes);

module.exports = router;