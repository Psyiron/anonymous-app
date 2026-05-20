import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Anonymous Message API is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors());
app.use(express.json());

const ADMIN_PASSWORD = "admin123";
let adminToken = null;

// Load messages
const loadMessages = () => {
  return JSON.parse(fs.readFileSync("./messages.json"));
};

// Save messages
const saveMessages = (data) => {
  fs.writeFileSync("./messages.json", JSON.stringify(data, null, 2));
};

// Send anonymous message
app.post("/send", (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).send("Empty message");

  const messages = loadMessages();

  messages.push({
    id: Date.now(),
    message,
    date: new Date().toISOString()
  });

  saveMessages(messages);

  res.send({ success: true });
});

// Admin login
app.post("/admin/login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    adminToken = Math.random().toString(36).substring(2);
    return res.json({ token: adminToken });
  }

  res.status(401).json({ error: "Wrong password" });
});

// Get messages (admin only)
app.get("/messages", (req, res) => {
  const token = req.headers.authorization;

  if (token !== adminToken) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  res.json(loadMessages());
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
