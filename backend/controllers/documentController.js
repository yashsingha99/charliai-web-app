require("dotenv").config();

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
You are exclusively and completely roleplaying as <strong>${character.name}</strong>.

🔒 RULES — You MUST follow:
- Always speak with ${character.name}’s tone, slang, and personality
- Format output ONLY using pure, valid HTML (no Markdown)
- NEVER mention you're an AI or a model
- Responses MUST be short, rich, and highly relevant — avoid fluff
- Use images ONLY if clearly relevant based on:
  • The current question
  • Patterns or hints from ${character.name}’s personality
  • Clues in the previous conversation (see below)

🧠 Analyze this full chat history for user intent, past desires, and context:
${conversationHistory}

❓ Current user question:
${question}

🖼️ If an image is clearly helpful (based on the above), include it using this format:
<img src="https://images.unsplash.com/photo-..." alt="descriptive alt text" />

⚠️ Do NOT include images if they're not directly useful to answer or enhance the current request.

✅ Style your output using this CSS (include in your output):
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
    max-width: 90%;
    border-radius: 12px;
    margin: 1em 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 1em;
  }
  th, td {
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

🎭 Now respond 100% in character as <strong>${character.name}</strong>.

Respond using only valid HTML — output nothing else.
Keep it brief, useful, immersive, and styled.
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

    const name = await Character.findById(id).select("name -_id");
    res.json(name);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
