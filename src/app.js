const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const loginRoutes = require("./routes/login/loginRoutes");
const notesRoutes = require("./routes/notes/notesRoutes");
const notedetailsRoutes = require("./routes/note-details/notedetails");
const profileRoutes = require('./routes/profile/profileRoutes');
const otherRoutes = require('./routes/others/otherRoutes');
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const api = process.env.API;
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
  origin: '*', // Or specify your allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/logo", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "SpNotz.png"));
})

app.get(`${api}/`, (req, res) => {
  res.send("Hello");
});

app.use(`${api}/auth`, loginRoutes);
app.use(`${api}/notes`, notesRoutes);
app.use(`${api}/notesummary`, notedetailsRoutes);
app.use(`${api}/profile`, profileRoutes);
app.use(`${api}/publish`, otherRoutes);

module.exports = app;
