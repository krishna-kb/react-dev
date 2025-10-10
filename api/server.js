const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- In-Memory Storage for Chat Histories ---
const chatHistories = {};

// --- Expanded Mock Data ---
const gibberish = [
  "Blork zorp flibbertigibbet.",
  "Glim-glam snoo-snoo.",
  "Floop dee-doop.",
  "Zibble-zabble wibble-wobble.",
  "Snicker-snack, a-flumph.",
  "Quibble-quabble, a-fizz.",
  "Zorp! Gloop. Bleep.",
  "Wobbledy-wobbledy, a-splat.",
  "Flibbertigibbet nonsense.",
  "The snozzberries taste like snozzberries!",
  "A wild plumbus appeared!",
  "Gazorpazorpfield is not amused.",
  "Wubba lubba dub dub!",
  "Squanchy squanches squanchily.",
  "The froods are hoopy.",
  "Don't panic.",
  "Time is an illusion. Lunchtime doubly so.",
  "So long, and thanks for all the fish.",
  "The answer is 42.",
  "Mostly harmless.",
];

const userMessages = [
  "Tell me more.",
  "How does that work?",
  "Interesting.",
  "Can you elaborate?",
  "Okay, what's next?",
  "I see.",
  "What do you mean by that?",
  "Could you explain it differently?",
  "That's fascinating.",
  "Why is that the case?",
  "And then what happened?",
  "Is that always true?",
  "Let's move on.",
  "What are the implications?",
  "I'm not sure I follow.",
  "Can you give me an example?",
  "That makes sense.",
];

// --- Helper to generate a new history ---
const generateMockHistory = (count) => {
  const history = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    history.push({
      text:
        i % 2 === 0
          ? userMessages[i % userMessages.length]
          : gibberish[i % gibberish.length],
      sender: i % 2 === 0 ? "user" : "ai",
      timestamp: now - (count - i) * 1000, // Simulate messages being 1 second apart
    });
  }
  return history;
};

// --- API Endpoints ---

// Get (or create) the chat history for a session
app.get("/api/history", (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  if (!chatHistories[sessionId]) {
    console.log(`Creating new history for sessionId: ${sessionId}`);
    chatHistories[sessionId] = generateMockHistory(1500);
  }

  res.json(chatHistories[sessionId]);
});

// Handle a new chat message for a session
app.post("/api/chat", (req, res) => {
  const { sessionId } = req.query;
  const { message } = req.body;

  if (!sessionId || !message) {
    return res
      .status(400)
      .json({ error: "sessionId and message are required" });
  }

  if (!chatHistories[sessionId]) {
    chatHistories[sessionId] = [];
  }

  // Add user message with timestamp
  chatHistories[sessionId].push({
    text: message,
    sender: "user",
    timestamp: Date.now(),
  });

  // Generate and add AI response with timestamp
  const aiResponse = gibberish[Math.floor(Math.random() * gibberish.length)];
  const aiMessage = {
    text: aiResponse,
    sender: "ai",
    timestamp: Date.now() + 500,
  }; // Simulate AI "thinking" time
  chatHistories[sessionId].push(aiMessage);

  setTimeout(() => {
    // Send back the full AI message object for consistency
    res.json(aiMessage);
  }, 500);
});

app.listen(port, () => {
  console.log(`Chat API server listening at http://localhost:${port}`);
});
