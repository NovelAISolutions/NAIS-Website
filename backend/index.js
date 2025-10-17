// ======================= index.js =======================
// Main Express backend for NAIS contact form
// ---------------------------------------------------------

import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Default route for testing
app.get("/", (req, res) => {
  res.send("✅ NAIS backend API is running successfully!");
});

// Contact API route
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message)
      return res.status(400).json({ success: false, error: "All fields required" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission — Novel AI Solutions`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n\nReceived: ${new Date().toISOString()}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Contact API Error:", err);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
