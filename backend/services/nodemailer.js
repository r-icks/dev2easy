import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export const sendMagicEmail = async ({ name, email, magicLink }) => {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "Suvidha Login Assist",
    html: `
      <p>Hello ${name},</p>
      <p>You requested a magic link to login to Suvidha. Click the link below to login:</p>
      <a href="${magicLink}">Login to Suvidha</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>Best regards,<br/>Suvidha Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};
