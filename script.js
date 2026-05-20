const API = "https://your-backend-url.onrender.com";

function sendMessage() {
  const message = document.getElementById("message").value;

  fetch(`${API}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
  .then(res => res.json())
  .then(() => {
    document.getElementById("status").innerText = "Sent anonymously!";
  });
}