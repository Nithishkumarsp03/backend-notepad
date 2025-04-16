const express = require('express')
const app = express();
require("dotenv").config();
app.use(express.json());
const loginRoutes = require('./routes/login/loginRoutes');
const notesRoutes = require('./routes/notes/notesRoutes');
const notedetailsRoutes = require('./routes/note-details/notedetails');

const api = process.env.API;

app.get(`${api}/`, (req, res) => {res.send("Hello")})

app.use(`${api}/auth`, loginRoutes);
app.use(`${api}/notes`, notesRoutes);
app.use(`${api}/notesummary`, notedetailsRoutes);

module.exports = app;