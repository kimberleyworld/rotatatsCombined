require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS options
const corsOptions = {
  origin: ["https://yourdomain.com", "http://localhost:3000"],
  methods: ["POST", "GET"],
  credentials: true,
};
app.use(cors(corsOptions));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'FrontEnd')));

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true,
});

// Email route
app.post("/send-emails", async (req, res) => {
  const emails = req.body;

  try {
    for (const { to, subject, text, image } of emails) {
      const imageBuffer = Buffer.from(image.replace(/^data:image\/jpeg;base64,/, ""), "base64");
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        attachments: [{ filename: "sketch.jpeg", content: imageBuffer }],
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).send("Emails sent successfully.");
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).send("Failed to send emails.");
  }
});

// Audio files route
app.use("/audio", express.static(path.join(__dirname, "audio")));
app.get("/audio-files", (req, res) => {
  const audioDir = path.join(__dirname, "audio");
  fs.readdir(audioDir, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory");
    }
    const audioFiles = files.filter(file => path.extname(file) === ".mp3").map(file => ({
      name: path.basename(file, ".mp3"),
      src: `/audio/${file}`,
    }));
    res.json(audioFiles);
  });
});

// Serve static files from the "prev work" and "flash" folders
app.use("/prevTattoos", express.static(path.join(__dirname, "prevTattoos")));
app.use("/flash", express.static(path.join(__dirname, "flash")));

// Fetch all images in the "prev work" folder
app.get("/prevTattoos", (req, res) => {
  const prevWorkDir = path.join(__dirname, "prevTattoos");
  fs.readdir(prevWorkDir, (err, files) => {
    if (err) return res.status(500).send("Unable to scan directory");

    const imageFiles = files.map(file => ({
      name: path.basename(file, path.extname(file)), // Remove extension
      src: `/prevTattoos/${file}`, // Path to access the file
    }));

    res.json(imageFiles);
  });
});

// Fetch all images in the "flash" folder
app.get("/flash-images", (req, res) => {
  const flashDir = path.join(__dirname, "flash");
  fs.readdir(flashDir, (err, files) => {
    if (err) return res.status(500).send("Unable to scan directory");

    const imageFiles = files.map(file => ({
      name: path.basename(file, path.extname(file)),
      src: `/flash/${file}`,
    }));

    res.json(imageFiles);
  });
});


// Fallback route for the root path, serve index.html for frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "FrontEnd", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
