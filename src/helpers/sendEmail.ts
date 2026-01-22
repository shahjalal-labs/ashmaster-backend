import nodemailer from "nodemailer";
import config from "../config";
const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string,
) => {
  // Create a transporter
  //development phase mail send
  /* const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
  }); */

  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: config.emailSender.email, 
      pass: config.emailSender.app_pass,
    },
  });

  // Email options
  const mailOptions = {
    from: `Bridge Connection: <${config.emailSender.email}>`,
    to,
    subject,
    html,
    text,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
