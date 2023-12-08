const fs = require("node:fs/promises");
const path = require("node:path");
const jimp = require("jimp");

const User = require("../models/user");
const verifyMail = require("../helpers/verifyMail");

async function resizeImage(path) {
  const image = await jimp.read(path);

  image.contain(250, 250);

  await image.writeAsync(path);
};

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.user.id).exec();

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.avatarURL === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    res.send(user.avatarURL);
  } catch (error) {
    next(error);
  }
}

async function uploadAvatar(req, res, next) {
  try {

    await resizeImage(req.file.path);

    await fs.rename(
      req.file.path,
      path.join(__dirname, "..", "public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.user.id,
      { avatarURL: `/avatars/${req.file.filename}` },
      { new: true }
    ).exec();

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
}

async function verify(req, res, next) {
const { email } = req.body;
console.log(email);
if (email === undefined) {
  return res.status(400).json({ "message": "Missing required field email" });
}

const user = await User.findOne({ email }).exec();

if (user === null) {
  return res.status(404).json({ "message": "User not found" });
};
if (user.verify) {
  return res.status(400).json({ "message": "Verification has already been passed" });
};

const verificationToken = user.verificationToken;

verifyMail(email, verificationToken);

res.status(200).json({ "message": "Verification email sent" })
};

module.exports = { getAvatar, uploadAvatar, verify };
