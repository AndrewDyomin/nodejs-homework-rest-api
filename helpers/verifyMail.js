require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function verifyMail (email, verificationToken) {

const message = {
  to: email,
  from: "dyomin.andrew1@gmail.com",
  subject: "This is verification mail",
  html: `<a href="http://localhost:3000/auth/register/verify/${verificationToken}">link</a>`,
  text: "Node.js is awesome platform",
};

sgMail
  .send(message)
  .then((response) => console.info(response))
  .catch((error) => console.error(error.response.body));

console.log("Mail sent");
}

module.exports = verifyMail;