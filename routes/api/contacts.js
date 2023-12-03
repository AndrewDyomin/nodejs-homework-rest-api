const express = require("express");
const ContactController = require("../../controllers/contact");

const router = express.Router();
const isValidId = require("../../middlewares/validId")


router.get("/", ContactController.listContacts);

router.get("/:id", isValidId, ContactController.getContactById);

router.post("/", ContactController.addContact);

router.delete("/:id", isValidId, ContactController.deleteContact);

router.put("/:id", isValidId, ContactController.updateContact);

router.patch("/:id/favorite", isValidId, ContactController.patchContact);

module.exports = router;

