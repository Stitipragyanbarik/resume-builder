import express from "express";
import Resume from "../models/Resume.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import nodemailer from "nodemailer";

const router = express.Router();

// ✅ Generate ID
const generateId = () => "RES-" + Date.now();


// =====================
// ✅ CREATE
// =====================
// CREATE (UPDATED)
router.post("/create", async (req, res) => {
  try {
    const { name, skills } = req.body;

    if (!name || !skills || skills.length === 0) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newResume = new Resume({
      resumeId: "RES-" + Date.now(),
      name,
      skills,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      logs: [{ action: "Resume Created" }]
    });

    await newResume.save();
    res.status(201).json(newResume);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving resume" });
  }
});


// =====================
// ✅ GET ALL (ADMIN)
// =====================
router.get("/", async (req, res) => {
  try {
    const data = await Resume.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data" });
  }
});


// =====================
// ✅ UPDATE
// =====================
router.put("/:id", async (req, res) => {
  try {
    const { name, skills } = req.body;

    const updated = await Resume.findByIdAndUpdate(
      req.params.id,
      { name, skills },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});


// =====================
// ✅ DELETE
// =====================
router.delete("/:id", async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});


// =====================
// ✅ DOWNLOAD PDF
// =====================
router.get("/download/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).send("Resume not found");
    }

    if (new Date() > resume.expiresAt) {
      return res.send("This resume link has expired.");
    }

    const filePath = `resume-${resume._id}.pdf`;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("Resume", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${resume.name}`);
    doc.text(`Skills: ${resume.skills.join(", ")}`);

    doc.end();

    // ✅ Track download
    resume.downloads += 1;
    resume.logs.push({ action: "Downloaded" });
    await resume.save();

    res.download(filePath);

  } catch (err) {
    console.log("PDF ERROR 👉", err);
    res.status(500).send("Error generating PDF");
  }
});


// =====================
// ✅ EMAIL SEND
// =====================
// EMAIL (UPDATED VALIDATION)
router.post("/email/:id", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).send("Invalid email");
    }

    const resume = await Resume.findById(req.params.id);

    const filePath = `resume-${resume._id}.pdf`;

    if (!fs.existsSync(filePath)) {
      return res.send("Download first");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your@gmail.com",
        pass: "your_app_password"
      }
    });

    await transporter.sendMail({
      from: "your@gmail.com",
      to: email,
      subject: "Resume",
      text: `Resume ID: ${resume.resumeId}`,
      attachments: [{ path: filePath }]
    });

    resume.logs.push({ action: "Email Sent" });
    await resume.save();

    res.send("Email sent");

  } catch (err) {
    res.status(500).send("Error");
  }
});



export default router;