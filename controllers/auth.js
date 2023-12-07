const bcrypt = require("bcrypt");
const userSchema = require("../schemas/user");
const User = require("../models/user");
const verifyMail = require("../helpers/verifyMail");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require('uuid');

async function register(req, res, next) {
  const response = userSchema.validate(req.body, { abortEarly: false });

  if (typeof response.error !== "undefined") {
    return res
      .status(400)
      .send(response.error.details.map((err) => err.message).join(", "));
  }

  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (user !== null) {
      return res.status(409).json({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();

    verifyMail(email, verificationToken);

    const newUser = await User.create({ name, email, password: passwordHash, avatarURL, verificationToken });

    res
      .status(201)
      .send({ user: { email: newUser.email, password: newUser.password } });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const response = userSchema.validate(req.body, { abortEarly: false });

  if (typeof response.error !== "undefined") {
    return res
      .status(400)
      .send(response.error.details.map((err) => err.message).join(", "));
  }
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

  if (user.verify === false) {
    console.log("VERIFY");
    return res
      .status(401)
      .send({ message: "User is not verified" });
  }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      console.log("PASSWORD");
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    if (user === null) {
      console.log("EMAIL");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await User.findByIdAndUpdate(user._id, { token }).exec();

    res
      .status(200)
      .send({ token, user: { email: user.email, password: user.password } });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const { _id } = req.user.user;

    await User.findByIdAndUpdate(_id, { token: null }).exec();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  const { email, subscription } = req.user.user;

  res
  .status(200)
  .send({ email, subscription });
}

async function verifyUser(req, res, next) {
  let { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken }).exec();

  if (user === null) {
    return res.status(404).json({"message": "User not found"})
  }

  verificationToken = null;
  const verify = true;
  await User.findByIdAndUpdate(user._id, { verificationToken, verify }).exec();
  res.status(200).json({ "message": "Verification successful" })
};

module.exports = { register, login, logout, current, verifyUser };
