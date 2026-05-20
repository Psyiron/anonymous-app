let token = localStorage.getItem("token");
let messages = [];
let index = 0;

// ================= LOGIN =================
async function login() {
  const password = document.getElementById("password").value;

  const res = await fetch("/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });

  const data = await res.json();

  if (data.token) {
    token = data.token;
    localStorage.setItem("token", token);
    alert("Login successful!");

    loadMessages();
    startLiveUpdates();
  } else {
    alert("Wrong password");
  }
}

// ================= LOAD MESSAGES =================
async function loadMessages() {
  if (!token) return;

  const res = await fetch("/messages", {
    headers: { "Authorization": token }
  });

  const data = await res.json();

  messages = data;
  index = 0;

  showMessage();
}

// ================= SHOW MESSAGE (CAROUSEL) =================
function showMessage() {
  const box = document.getElementById("messageBox");
  const counter = document.getElementById("counter");

  if (messages.length === 0) {
    box.innerText = "No messages yet";
    counter.innerText = "";
    return;
  }

  const msg = messages[index];

  box.innerText = `No.${index + 1}... ${msg.message}`;
  counter.innerText = `${index + 1} / ${messages.length}`;
}

// ================= NAVIGATION =================
function nextMessage() {
  if (index < messages.length - 1) {
    index++;
    showMessage();
  }
}

function prevMessage() {
  if (index > 0) {
    index--;
    showMessage();
  }
}

// ================= LIVE UPDATES =================
function startLiveUpdates() {
  setInterval(() => {
    loadMessages();
  }, 5000); // refresh every 5 seconds
}
