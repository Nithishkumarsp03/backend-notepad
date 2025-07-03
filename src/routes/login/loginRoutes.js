const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/login/fetchcategory");
const authLogin = require('../../controllers/login/authLogin');
const authRegister = require('../../controllers/login/authRegister');
const verifyOtp = require('../../controllers/login/verifyOtp');
const requestReset = require("../../controllers/login/authRequestreset");
const resetPassword = require("../../controllers/login/authResetpassword");

router.get("/fetchcategory", categoryController.fetchCategory);
router.post("/login", authLogin.login);
router.post("/register", authRegister.register);
router.post("/check-otp", verifyOtp.verifyOtp);
router.post("/request-reset", requestReset.requestReset);
router.post("/reset-password" , resetPassword.resetPassword);

module.exports = router;
