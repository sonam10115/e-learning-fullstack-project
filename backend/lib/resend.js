const { Resend } = require("resend");
const { ENV } = require("./env.js");

const resendClient = new Resend(ENV.RESEND_API_KEY);

const sender = {
  email: ENV.EMAIL_FROM,
  name: ENV.EMAIL_FROM_NAME,
};

module.exports = { resendClient, sender };
