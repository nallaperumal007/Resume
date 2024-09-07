const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

app.use(express.json());
app.use(cors());
app.use("/files", express.static("files"));

// MongoDB connection
const mongoUrl = "mongodb://localhost:27017";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Import model
const PdfDetails = require("./pdfDetails");

// Route to upload files and other details
app.post("/upload-files", upload.single("resume"), async (req, res) => {
  const {
    name,
    mobileNumber,
    location,
    email,
    skillSet,
    remarks,
    portfolio,
    address,
    type,
    techStack
  } = req.body;
  const resume = req.file ? req.file.filename : null;

  if (!name || !mobileNumber || !location || !email || !skillSet || !remarks || !portfolio || !address || !type || !techStack || !resume) {
    return res.status(400).send({ status: 'error', message: 'All fields are required.' });
  }

  try {
    await PdfDetails.create({
      name,
      mobileNumber,
      location,
      email,
      skillSet,
      remarks,
      portfolio,
      address,
      type,
      techStack,
      resume
    });
    res.send({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
});

// Route to get all files and details
app.get("/get-files", async (req, res) => {
  try {
    const data = await PdfDetails.find({});
    res.send({ status: "ok", data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
});

// Root route
app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});

// Start the server
app.listen(5000, () => {
  console.log("Server Started");
});
