const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/login/fetchcategory");
const authLogin = require('../../controllers/login/authLogin');
const authRegister = require('../../controllers/login/authRegister')

router.get("/fetchcategory", categoryController.fetchCategory);
router.post("/login", authLogin.login);
router.post("/register", authRegister.register);

module.exports = router;
