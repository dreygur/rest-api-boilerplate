import nodemailer from 'nodemailer';

export default function NewTransport(options) {
  return nodemailer.createTransport({
    host: options.SMTP_HOST,
    port: options.SMTP_PORT,
    auth: {
      user: options.SMTP_USER,
      pass: options.SMTP_PASSWORD
    }
  });
}