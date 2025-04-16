const express = require("express");
const router = express.Router();
const addController = require('../../controllers/notes/newNote');
const fetchnotesController = require('../../controllers/notes/fetchNotes');
const editNotes = require('../../controllers/notes/editNotes');
const deleteNotes = require('../../controllers/notes/deleteNotes')

router.post('/addnote', addController.addnewnote);
router.post('/fetchnotes', fetchnotesController.fetchNotes);
router.post('/editnotes', editNotes.editNotes);
router.post('/deletenotes', deleteNotes.deleteNotes);

module.exports = router;