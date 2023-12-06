const express = require("express");

const UsersController = require("../../controllers/users");
const isAuth = require("../../middlewares/isAuth")
const upload = require("../../middlewares/upload");

const router = express.Router();

router.get("/avatars", isAuth, UsersController.getAvatar)
router.patch("/avatars", isAuth, upload.single("avatar"), UsersController.uploadAvatar)

module.exports = router;