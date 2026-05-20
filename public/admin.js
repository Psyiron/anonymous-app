let token = localStorage.getItem("token");

async function login() {
  const password = document.getElementById("password").value;

  const res = await fetch("/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
  });

  const data = await res.json();

  if (data.token) {
    token = data.token;
    localStorage.setItem("token", token);
    alert("Login successful!");
    loadMessages();
  } else {
    alert("Wrong password");
  }
}

async function loadMessages() {
  if (!token) {
    alert("Please login first");
    return;
  }

  const res = await fetch("/messages", {
    headers: {
      "Authorization": token
    }
  });

  const data = await res.json();

  const container = document.getElementById("messages");
  container.innerHTML = "";

  data.forEach(msg => {
    const div = document.createElement("div");
    div.className = "msg";
    div.innerText = `${msg.date} - ${msg.message}`;
    container.appendChild(div);
  });
}
