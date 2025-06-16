const express = require("express");
const router = express.Router();
const editProfile = require('../../controllers/profile/editProfile')

router.post('/editprofile', editProfile.editProfile);

module.exports = router;