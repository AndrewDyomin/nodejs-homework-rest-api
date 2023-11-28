const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const ContactController = require("../../controllers/contact");

const jsonParser = express.json();
const router = express.Router();
const contactsPath = path.join(__dirname, "../../db/contacts.json");
const contactSchema = require("../../schemas/contact");


router.get("/", ContactController.listContacts);

router.get("/:id", ContactController.getContactById);

router.post("/", ContactController.addContact);

router.delete("/:id", ContactController.deleteContact);

router.put("/:id", ContactController.updateContact);

router.patch("/:id/favorite", ContactController.patchContact);

module.exports = router;
