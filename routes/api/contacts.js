const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const ContactController = require("../../controllers/contact");

const jsonParser = express.json();
const router = express.Router();
const contactsPath = path.join(__dirname, "../../db/contacts.json");
const contactSchema = require("../../schemas/contact");
const isValidId = require("../../middlewares/validId")


router.get("/", ContactController.listContacts);

router.get("/:id", isValidId, ContactController.getContactById);

router.post("/", ContactController.addContact);

router.delete("/:id", isValidId, ContactController.deleteContact);

router.put("/:id", isValidId, ContactController.updateContact);

router.patch("/:id/favorite", isValidId, ContactController.patchContact);

module.exports = router;

