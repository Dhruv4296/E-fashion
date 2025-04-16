const express=require("express");

const router=express.Router();
const authController=require("../controllers/auth.controller.js")


router.post("/signup",authController.register)
router.post("/signin",authController.login)
router.post("/reset-password-request", authController.requestPasswordReset)
router.post("/reset-password", authController.resetPassword)

module.exports=router;