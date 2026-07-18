require("dotenv").config({ path: "./server/.env" });

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const multer = require("multer");
const app = express();

app.use(cors());
app.use(express.json());
const upload = multer({
  dest: "uploads/"
});
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Homework AI Server चालू आहे!");
});

app.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;

    const chat = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    res.json({
      answer: chat.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      answer: "AI कडून उत्तर मिळाले नाही.",
    });
  }
});
app.post("/upload-pdf", upload.single("pdf"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            message: "PDF मिळाली नाही."
        });
    }

    res.json({
        message: "PDF यशस्वीरित्या Upload झाली.",
        file: req.file.filename
    });

});
app.listen(3000, () => {
  console.log("🚀 Homework AI Server चालू झाला!");
});