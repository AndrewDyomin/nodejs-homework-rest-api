const Contact = require("../models/contact");
const contactSchema = require("../schemas/contact");
const favoriteContactSchema = require("../schemas/favoriteContact");

async function updateStatusContact(id, body) {
  try {
    const contact = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      favorite: body.favorite,
    };
  
    const result = await Contact.findByIdAndUpdate(id, contact, { new: true });

    if (result === null) {
      return res.status(404).json({ "message": "Not found" });
    };

    return result;
  } catch (error) {
    console.error(error);
  }
}

async function listContacts(req, res, next) {
  try {
    const contacts = await Contact.find().exec();

    res.send(contacts);
  } catch (err) {
    next(err);
  }
}

async function getContactById(req, res, next) {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id).exec();

    if (contact === null) {
      return res.status(404).send("Contact not found");
    }

    res.send(contact);
  } catch (err) {
    next(err);
  }
}

async function addContact(req, res, next) {
  const response = contactSchema.validate(req.body, { abortEarly: false });

  if (typeof response.error !== "undefined") {
    return res
      .status(400)
      .send(response.error.details.map((err) => err.message).join(", "));
  }

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  try {
    const result = await Contact.create(contact);

    res.status(201).send(result);
  } catch (err) {
    next(err);
  }
}

async function updateContact(req, res, next) {
  const { id } = req.params;
  const response = contactSchema.validate(req.body, { abortEarly: false });

  if (typeof response.error !== "undefined") {
    return res
      .status(400)
      .send(response.error.details.map((err) => err.message).join(", "));
  }

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  try {
    const result = await Contact.findByIdAndUpdate(id, contact, { new: true });

    if (result === null) {
      return res.status(404).send("Contact not found");
    }

    res.send(result);
  } catch (err) {
    next(err);
  }
}

async function deleteContact(req, res, next) {
  const { id } = req.params;

  try {
    const result = await Contact.findByIdAndDelete(id);

    if (result === null) {
      return res.status(404).send("Contact not found");
    }

    res.send({ id });
  } catch (err) {
    next(err);
  }
}

async function patchContact(req, res, next) {
  const response = favoriteContactSchema.validate(req.body, { abortEarly: false });
  const { id } = req.params;

  if (typeof response.error !== "undefined") {
    return res
      .status(400)
      .send(response.error.details.map((err) => err.message).join(", "));
  }

  const body = response.value;

  try {
    const contact = {
      // name: body.name,
      // email: body.email,
      // phone: body.phone,
      favorite: body.favorite,
    };
  
    const result = await Contact.findByIdAndUpdate(id, contact, { new: true });

    res.send(result);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
  patchContact,
};
