import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export async function getTransporter() {
  if (transporter) return transporter;
  const account = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: { user: account.user, pass: account.pass },
  });
  console.log("Ethereal account:", account.user, account.pass);
  return transporter;
}

export async function sendEmail(opts: {
  from: string;
  to: string;
  subject: string;
  html: string;
}) {
  const t = await getTransporter();
  const info = await t.sendMail(opts);
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  return info;
}
