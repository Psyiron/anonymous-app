async function sendMessage() {
  const message = document.getElementById("message").value;
  const status = document.getElementById("status");

  if (!message) {
    status.innerText = "Message cannot be empty";
    return;
  }

  const res = await fetch("/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await res.json();

  if (data.success) {
    status.innerText = "Message sent successfully!";
    document.getElementById("message").value = "";
  } else {
    status.innerText = "Failed to send message";
  }
}
