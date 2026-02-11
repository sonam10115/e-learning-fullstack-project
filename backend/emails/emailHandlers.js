const { resendClient, sender } = require("../lib/resend.js");
const { createWelcomeEmailTemplate } = require("../emails/emailTemplates.js");

const sendWelcomeEmail = async (email, name, clientURL) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to Civora Nexus Education Platform!",
        html: createWelcomeEmailTemplate(name, clientURL),
    });

    if (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }

    console.log("Welcome Email sent successfully", data);
};

module.exports = { sendWelcomeEmail };
