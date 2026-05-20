const API = "https://your-backend-url.onrender.com";
let token = null;

function login() {
  const password = document.getElementById("password").value;

  fetch(`${API}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  })
  .then(res => res.json())
  .then(data => {
    token = data.token;

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
  });
}

function loadMessages() {
  fetch(`${API}/messages`, {
    headers: { Authorization: token }
  })
  .then(res => res.json())
  .then(data => {
    const box = document.getElementById("messages");
    box.innerHTML = "";

    data.reverse().forEach(msg => {
      const div = document.createElement("div");
      div.className = "message-box";
      div.innerText = msg.message;
      box.appendChild(div);
    });
  });
}