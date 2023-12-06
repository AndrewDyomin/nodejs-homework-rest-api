const fs = require("node:fs/promises");
const path = require("node:path");
const jimp = require("jimp");

const User = require("../models/user");

async function getAvatar(req, res, next) {
  try {
    console.log(req.user)
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
    await fs.rename(
      req.file.path,
      path.join(__dirname, "..", "public/avatars", req.file.filename)
    );

    const image = await jimp.read(`${req.file.path}`);
    image.cover(250, 250);

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

module.exports = { getAvatar, uploadAvatar };