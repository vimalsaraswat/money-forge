import nodemailer from "nodemailer";

// Create a transporter using SMTP
let transporterInstance: nodemailer.Transporter;

export const transporter = () => {
  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporterInstance;
};
