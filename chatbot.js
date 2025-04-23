const apiKey = "AIzaSyDg7nq6MpIxN8xWk9iB7kQ_T74w2fiFMxc"; // **REPLACE WITH YOUR ACTUAL API KEY**
const apiUrl =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDg7nq6MpIxN8xWk9iB7kQ_T74w2fiFMxc";
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.querySelector(".chat-messages");
const welcomeMessage = document.querySelector(".welcome-message");

// Function to add a message to the chat
function addMessage(text, isUser) {
  if (isUser && welcomeMessage.style.display !== "none") {
    welcomeMessage.style.display = "none";
  }

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", isUser ? "user-message" : "bot-message");
  messageDiv.textContent = isUser ? `You: ${text}` : `AI: ${text}`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to get a response from the Gemini API
async function getGeminiResponse(userMessage) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDg7nq6MpIxN8xWk9iB7kQ_T74w2fiFMxc";
  const requestData = {
    contents: [
      {
        parts: [{ text: userMessage }],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    const data = await response.json();
    console.log("API Response:", data);

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "No response received.";
    }
  } catch (error) {
    console.error("Error:", error);
    return "Sorry, I couldn't process your request.";
  }
}

// Function to handle sending a message
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  userInput.value = "";
  userInput.disabled = true;
  sendButton.disabled = true;

  // Show typing indicator
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("message", "bot-message");
  typingIndicator.textContent = "AI is typing...";
  chatMessages.appendChild(typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const botResponse = await getGeminiResponse(message);
    typingIndicator.remove();
    addMessage(botResponse, false);
  } catch (error) {
    typingIndicator.remove();
    addMessage("Error: " + error.message, false);
  } finally {
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
  }
}

// Event listeners
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
