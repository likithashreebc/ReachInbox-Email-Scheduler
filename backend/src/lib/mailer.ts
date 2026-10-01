import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    console.log("Using Gmail SMTP:", process.env.GMAIL_USER);
  } else {
    // Fallback to Ethereal for local dev
    const account = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: { user: account.user, pass: account.pass },
    });
    console.log("Using Ethereal (fake) SMTP — emails won't reach real inboxes");
    console.log("Ethereal account:", account.user);
  }

  return transporter;
}

export async function sendEmail(opts: {
  from: string;
  to: string;
  subject: string;
  html: string;
}) {
  const t = await getTransporter();

  // If using Gmail, override from address (Gmail ignores custom from)
  const from = process.env.GMAIL_USER
    ? `ReachInbox <${process.env.GMAIL_USER}>`
    : opts.from;

  const info = await t.sendMail({ ...opts, from });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) console.log("Preview URL:", previewUrl);
  else console.log(`Email sent to ${opts.to}`);

  return info;
}
