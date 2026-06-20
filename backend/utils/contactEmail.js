const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ── Contact form: confirmation to the person who submitted ── */
const sendContactConfirmation = async (contact) => {
  const mailOptions = {
    from: `"Akiira Tech" <${process.env.EMAIL_USER}>`,
    to: contact.email,
    subject: `We received your message — Akiira Tech`,
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf7fc;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#3b1b4d,#7a3d8c);padding:40px 32px;text-align:center;">
          <h1 style="color:#fff;font-size:28px;margin:0 0 8px;">AKIIRA <span style="color:#6bbf73;">TECH</span></h1>
          <p style="color:rgba(255,255,255,0.75);margin:0;font-size:14px;">Nigeria's #1 Web Dev Studio</p>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#3b1b4d;margin:0 0 8px;">Hey ${contact.firstName}! 👋</h2>
          <p style="color:#7a5d8a;line-height:1.7;margin:0 0 24px;">
            Thanks for reaching out about <strong style="color:#3b1b4d;">${contact.service}</strong>.
            We've received your message and our team will respond within <strong>2-4 hours</strong>.
          </p>
          <div style="background:#fff;border:1px solid rgba(59,27,77,0.1);border-radius:12px;padding:20px 24px;margin-bottom:24px;">
            <h3 style="color:#3b1b4d;margin:0 0 16px;font-size:16px;">Your Submission</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#7a5d8a;font-size:14px;width:35%;">Name</td><td style="padding:6px 0;color:#3b1b4d;font-size:14px;font-weight:600;">${contact.firstName} ${contact.lastName}</td></tr>
              <tr><td style="padding:6px 0;color:#7a5d8a;font-size:14px;">Email</td><td style="padding:6px 0;color:#3b1b4d;font-size:14px;font-weight:600;">${contact.email}</td></tr>
              <tr><td style="padding:6px 0;color:#7a5d8a;font-size:14px;">Phone</td><td style="padding:6px 0;color:#3b1b4d;font-size:14px;font-weight:600;">${contact.phone}</td></tr>
              <tr><td style="padding:6px 0;color:#7a5d8a;font-size:14px;">Service</td><td style="padding:6px 0;color:#3b1b4d;font-size:14px;font-weight:600;">${contact.service}</td></tr>
              <tr><td style="padding:6px 0;color:#7a5d8a;font-size:14px;">Budget</td><td style="padding:6px 0;color:#3b1b4d;font-size:14px;font-weight:600;">${contact.budget}</td></tr>
            </table>
          </div>
          <p style="color:#7a5d8a;font-size:14px;line-height:1.7;margin:0 0 24px;">
            Need a faster response? Reach us directly on WhatsApp: <strong>+2349021706710</strong>
          </p>
          <a href="https://wa.me/2349021706710" style="display:inline-block;background:linear-gradient(135deg,#6bbf73,#4d9e55);color:#fff;padding:13px 28px;border-radius:100px;text-decoration:none;font-weight:700;font-size:14px;">💬 Chat on WhatsApp</a>
        </div>
        <div style="background:#3b1b4d;padding:20px 32px;text-align:center;">
          <p style="color:rgba(255,255,255,0.45);font-size:12px;margin:0;">© 2026 Akiira Tech · akiiratech@gmail.com · Lagos, Nigeria</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

/* ── Contact form: internal notification to admin ── */
const sendContactAdminNotification = async (contact) => {
  const mailOptions = {
    from: `"Akiira Tech System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🆕 New Contact Form: ${contact.firstName} ${contact.lastName} — ${contact.service}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
        <h2 style="color:#3b1b4d;">New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;">
          <tr style="background:#f5f0fa;"><th style="padding:10px 16px;text-align:left;color:#3b1b4d;">Field</th><th style="padding:10px 16px;text-align:left;color:#3b1b4d;">Value</th></tr>
          <tr><td style="padding:10px 16px;border-top:1px solid #eee;color:#555;">Name</td><td style="padding:10px 16px;border-top:1px solid #eee;font-weight:600;">${contact.firstName} ${contact.lastName}</td></tr>
          <tr><td style="padding:10px 16px;border-top:1px solid #eee;color:#555;">Email</td><td style="padding:10px 16px;border-top:1px solid #eee;">${contact.email}</td></tr>
          <tr><td style="padding:10px 16px;border-top:1px solid #eee;color:#555;">Phone</td><td style="padding:10px 16px;border-top:1px solid #eee;">${contact.phone}</td></tr>
          <tr><td style="padding:10px 16px;border-top:1px solid #eee;color:#555;">Service</td><td style="padding:10px 16px;border-top:1px solid #eee;font-weight:600;color:#3b1b4d;">${contact.service}</td></tr>
          <tr><td style="padding:10px 16px;border-top:1px solid #eee;color:#555;">Budget</td><td style="padding:10px 16px;border-top:1px solid #eee;">${contact.budget}</td></tr>
          <tr><td style="padding:10px 16px;border-top:1px solid #eee;color:#555;">Message</td><td style="padding:10px 16px;border-top:1px solid #eee;">${contact.message}</td></tr>
          <tr><td style="padding:10px 16px;border-top:1px solid #eee;color:#555;">Date</td><td style="padding:10px 16px;border-top:1px solid #eee;">${new Date().toLocaleString('en-NG')}</td></tr>
        </table>
        <p style="margin-top:20px;color:#666;font-size:13px;">Log into the admin dashboard to respond.</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

/* ── Quick registration (contact page modal): confirmation ── */
const sendQuickRegConfirmation = async (reg) => {
  const mailOptions = {
    from: `"Akiira Tech" <${process.env.EMAIL_USER}>`,
    to: reg.email,
    subject: `Registration Received — Akiira Tech`,
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf7fc;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#3b1b4d,#7a3d8c);padding:40px 32px;text-align:center;">
          <h1 style="color:#fff;font-size:28px;margin:0 0 8px;">AKIIRA <span style="color:#6bbf73;">TECH</span></h1>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#3b1b4d;margin:0 0 8px;">Hey ${reg.fullName}! 🎉</h2>
          <p style="color:#7a5d8a;line-height:1.7;margin:0 0 24px;">
            We've received your registration. Our team will reach out shortly with next steps.
          </p>
          <a href="https://wa.me/2349021706710" style="display:inline-block;background:linear-gradient(135deg,#6bbf73,#4d9e55);color:#fff;padding:13px 28px;border-radius:100px;text-decoration:none;font-weight:700;font-size:14px;">💬 Chat on WhatsApp</a>
        </div>
        <div style="background:#3b1b4d;padding:20px 32px;text-align:center;">
          <p style="color:rgba(255,255,255,0.45);font-size:12px;margin:0;">© 2026 Akiira Tech · akiiratech@gmail.com</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

/* ── Quick registration: internal admin notification ── */
const sendQuickRegAdminNotification = async (reg) => {
  const mailOptions = {
    from: `"Akiira Tech System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🆕 New Quick Registration: ${reg.fullName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
        <h2 style="color:#3b1b4d;">New Quick Registration (Contact Page)</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;">
          <tr style="background:#f5f0fa;"><th style="padding:10px 16px;text-align:left;color:#3b1b4d;">Field</th><th style="padding:10px 16px;text-align:left;color:#3b1b4d;">Value</th></tr>
          <tr><td style="padding:10px 16px;border-top:1px solid #eee;color:#555;">Name</td><td style="padding:10px 16px;border-top:1px solid #eee;font-weight:600;">${reg.fullName}</td></tr>
          <tr><td style="padding:10px 16px;border-top:1px solid #eee;color:#555;">Email</td><td style="padding:10px 16px;border-top:1px solid #eee;">${reg.email}</td></tr>
          <tr><td style="padding:10px 16px;border-top:1px solid #eee;color:#555;">Phone</td><td style="padding:10px 16px;border-top:1px solid #eee;">${reg.phone}</td></tr>
          <tr><td style="padding:10px 16px;border-top:1px solid #eee;color:#555;">Source</td><td style="padding:10px 16px;border-top:1px solid #eee;">${reg.source}</td></tr>
          <tr><td style="padding:10px 16px;border-top:1px solid #eee;color:#555;">Message</td><td style="padding:10px 16px;border-top:1px solid #eee;">${reg.message}</td></tr>
        </table>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendContactConfirmation,
  sendContactAdminNotification,
  sendQuickRegConfirmation,
  sendQuickRegAdminNotification,
};