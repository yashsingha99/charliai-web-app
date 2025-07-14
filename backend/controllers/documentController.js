const dotenv = require("dotenv").config();
const axios = require("axios");
const QuestionAnswer = require("../models/questionAnswer");
const Character = require("../models/character");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

exports.askQuestion = async (req, res) => {
  try {
    const { question, id } = req.body;

    if (!question || !id) {
      return res.status(400).json({ message: "Question and character ID are required." });
    }

    // Fetch previous chat history
    const prevChattes = await QuestionAnswer.find({ character: id }).select("question answer");
    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ message: "Character not found." });
    }

    // 🧠 Build context history
    const conversationHistory = prevChattes
      .map((msg, idx) => `User: ${msg.question}\n${character.name}: ${msg.answer}`)
      .join("\n\n");

    // 💬 Enhanced prompt for multimedia response support
    const prompt = `
You are fully and exclusively roleplaying as **${character.name}**.
You can now respond using rich media formats (Markdown, tables, public image links, links to files, etc.)

🎭 STAY 100% IN CHARACTER:
- Use ${character.name}'s exact tone, slang, behavior, and history.
- NEVER break character. NEVER say you're AI.
- You CAN use markdown, tables, and public images or file links — like you're replying in an advanced chat.

✅ Supported response formats:
- **Markdown** formatting
- **Tables** (for data)
- **Images** from PUBLIC sources (unsplash, wikimedia, etc.)
- **Files/Links** (if relevant to the topic)

📜 Use the following history to understand context:
${conversationHistory}

❓ Current User Question:
${question}

🎙️ Respond AS ${character.name} using Markdown, images, tables, or links if needed:
`;

    // 🧠 Call Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text(); // Already supports Markdown from Gemini

    // Save new response to DB
    const newAnswer = new QuestionAnswer({
      question,
      answer,
      character: id,
    });
    await newAnswer.save();

    // Send structured response
    res.json({
      answer: answer.trim(),
      format: "markdown", // helps frontend know how to render
    });
  } catch (err) {
    console.error("Error in askQuestion:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getPreviousQAs = async (req, res) => {
  try {
    const qas = await QuestionAnswer.find().sort({ date: 1 });
    res.json(qas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPreviousQAsByCharacter = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id);
    
    const qas = await QuestionAnswer.find({ character: id }).sort({ date: 1 });
    res.json(qas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
