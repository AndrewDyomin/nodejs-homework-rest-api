const bcrypt = require("bcrypt");
const userSchema = require("../schemas/user");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

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
        return res.status(409).json({ "message": "Email in use" });
      }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: passwordHash });

    res.status(201).send({ user: { email: newUser.email, password: newUser.password } });
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

    if (user === null) {
      console.log("EMAIL");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      console.log("PASSWORD");
      return res
        .status(401)
        .json({ "message": "Email or password is wrong" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await User.findByIdAndUpdate(user._id, { token }).exec();

    res.status(200).send({ token, user: { email: user.email, password: user.password } });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };