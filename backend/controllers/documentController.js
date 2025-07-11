const dotenv = require("dotenv").config();

const axios = require("axios");
const QuestionAnswer = require("../models/questionAnswer");
const Character = require("../models/character");
const { GoogleGenAI } = require("@google/genai");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY );
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

const ai = new GoogleGenAI({});

exports.askQuestion = async (req, res) => {
  try {
    const { question, id } = req.body;

    if (!question || !id) {
      return res.status(400).json({ message: "Question and character ID are required." });
    }

    // Find the character by ID
    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ message: "Character not found." });
    }

    const prompt = `
You are now fully embodying the persona of **${character.name}**. 
Respond to the following question **exactly** as ${character.name} would—capturing their unique tone, attitude, worldview, vocabulary, and emotional nuance.

🎭 Stay completely in character:
- Mimic their iconic speech style, catchphrases, slang, dialect, or verbal quirks.
- Reflect their values, humor, background, and typical behavior.
- If they are from a known universe, reference events, people, or situations they would naturally talk about.
- Be bold—don't explain or break character. Do NOT say “As an AI…” or comment on being artificial.
- Avoid modern or out-of-character phrases unless ${character.name} would use them.

🎤 Imagine the character is answering live in an interview, script, or casual dialogue—keep it real, raw, and *them*.

🧠 If the character is fictional, use their most well-known portrayals. If real, reflect their public persona.

---
🧍 Character: ${character.name}
❓ Question: ${question}
🎙️ Response:
`;
 
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    const newAnswer = new QuestionAnswer({
      question,
      answer,
      character: id,
    });
    await newAnswer.save();

    res.json({ answer: answer.trim() });

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
