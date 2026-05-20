import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ======================
// FIX: __dirname for ES Modules
// ======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());

// ======================
// Serve frontend (IMPORTANT)
// ======================
app.use(express.static(path.join(__dirname, "public")));

// ======================
// Render PORT
// ======================
const PORT = process.env.PORT;

// ======================
// Home route → serves your website
// ======================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ======================
// Admin system
// ======================
const ADMIN_PASSWORD = "admin123";
let adminToken = null;

// ======================
// Safe file loader
// ======================
const loadMessages = () => {
  try {
    return JSON.parse(fs.readFileSync("./messages.json"));
  } catch (err) {
    return [];
  }
};

const saveMessages = (data) => {
  fs.writeFileSync("./messages.json", JSON.stringify(data, null, 2));
};

// ======================
// Send message
// ======================
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

// ======================
// Admin login
// ======================
app.post("/admin/login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    adminToken = Math.random().toString(36).substring(2);
    return res.json({ token: adminToken });
  }

  res.status(401).json({ error: "Wrong password" });
});

// ======================
// Get messages (admin only)
// ======================
app.get("/messages", (req, res) => {
  const token = req.headers.authorization;

  if (token !== adminToken) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  res.json(loadMessages());
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
