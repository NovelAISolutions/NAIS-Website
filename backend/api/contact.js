// ======================= api/contact.js =======================
import nodemailer from "nodemailer";

export const handleContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ success: false, error: "Missing fields" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Contact Form — ${name}`,
      text: message,
    });

    res.status(200).json({ success: true, message: "Mail sent!" });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ success: false, error: "Internal error" });
  }
};
