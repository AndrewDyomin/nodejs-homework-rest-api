const express = require("express");

const AuthController = require("../../controllers/auth");
const isAuth = require("../../middlewares/isAuth")

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, AuthController.register);
router.get("/register/verify/:verificationToken", jsonParser, AuthController.verifyUser);
router.post("/login", jsonParser, AuthController.login)
router.post("/logout", jsonParser, isAuth, AuthController.logout)
router.post("/current", jsonParser, isAuth, AuthController.current)

module.exports = router;