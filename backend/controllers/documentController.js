require("dotenv").config()

const QuestionAnswer = require("../models/questionAnswer");
const Character = require("../models/character");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

exports.askQuestion = async (req, res) => {
  try {
    const { question, id } = req.body;

    if (!question || !id) {
      return res
        .status(400)
        .json({ message: "Question and character ID are required." });
    }

    // Fetch previous chat history
    const prevChattes = await QuestionAnswer.find({ character: id }).select(
      "question answer"
    );
    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ message: "Character not found." });
    }

    // 🧠 Build context history
    const conversationHistory = prevChattes
      .map(
        (msg, idx) => `User: ${msg.question}\n${character.name}: ${msg.answer}`
      )
      .join("\n\n");

    // 💬 Enhanced prompt for multimedia response support
    const prompt = `
You are fully and exclusively roleplaying as <strong>${character.name}</strong>.

You now respond in rich **pure HTML** format — using valid tags like:
- <strong>, <em>, <p>, <ul>, <li>, <table>, <img>, <a>
- DO NOT use Markdown (like **bold**, *italic*, etc.)

🎭 STAY 100% IN CHARACTER:
- Use ${character.name}'s tone, slang, and personality
- NEVER mention that you're an AI or language model
- Don't break character or formatting

✅ Required HTML Styling:
- Use the following CSS in your output to style content:

<style>
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
  }
  p {
    margin-bottom: 1em;
  }
  img {
    max-width: 80%;
    border-radius: 12px;
    margin: 1em 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 1em;
  }
  table, th, td {
    border: 1px solid #ccc;
    padding: 8px;
  }
  a {
    color: #2563eb;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>

🖼️ To insert images:
- Use real **public image URLs** only
- Example image (correct format):
  <img src="https://images.unsplash.com/photo-1749738513460-e069e49ffdb6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Forest" />

📜 Here is the conversation history to understand context:
${conversationHistory}

❓ User’s current question:
${question}

🎙️ Now respond as <strong>${character.name}</strong> using pure HTML (with styled images and text). Include public image(s), styled text, lists, tables, or links if relevant.

Output only raw HTML, like:

<p>Hello there <strong>friend</strong>, nice to meet you!</p>
<img src="https://..." alt="Something cool" />
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
exports.getPreviousQsByCharacter = async (req, res) => {
  try {
    const { id } = req.query;

    const qs = await QuestionAnswer.find({ character: id })
      .select("_id question")
      .sort({ date: 1 });
    res.json(qs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getChatName = async (req, res) => {
  try {
    const { id } = req.query;

    const name = await Character.findById(id )
      .select("name -_id")
    res.json(name);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
