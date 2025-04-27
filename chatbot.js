const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.querySelector(".chat-messages");
const welcomeMessage = document.querySelector(".welcome-message");
const selectBtn = document.getElementById('paper-clip');
const fileInput = document.getElementById('pictureInput');
const imagePreview = document.getElementById('imagePreview');

// API Configuration
const apiKey = "AIzaSyDg7nq6MpIxN8xWk9iB7kQ_T74w2fiFMxc"; // Replace with your actual API key
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

// Function to add a message to the chat
function addMessage(content, isUser, isImage = false) {
  if (isUser && welcomeMessage.style.display !== "none") {
    welcomeMessage.style.display = "none";
  }

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", isUser ? "user-message" : "bot-message");

  if (isImage) {
    messageDiv.innerHTML = `<img src="${content}" style="max-width: 300px; border-radius: 8px;">`;
  } else {
    messageDiv.innerHTML = isUser ? content : parseTextToHtml(content);
  }

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Text parsing function (for bot responses)
function parseTextToHtml(plainText) {
        let html = "";
        const lines = plainText.split("\n");
        let inCodeBlock = false;
        let inUnorderedList = false;
        let inOrderedList = false;
      
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i].trim();
      
          // Remove leading/trailing asterisks (if that's the intent)
          line = line.replace(/^\*+|\*+$/g, '');
      
          if (line.startsWith("```")) {
            if (inUnorderedList) { html += "</ul>"; inUnorderedList = false; }
            if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
            inCodeBlock = !inCodeBlock;
            html += inCodeBlock ? "<pre>" : "</pre>";
            continue;
          }
      
          if (inCodeBlock) {
            html += line + "\n";
            continue;
          }
      
          if (line.startsWith("## ")) {
            if (inUnorderedList) { html += "</ul>"; inUnorderedList = false; }
            if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
            html += `<h2>${line.substring(3)}</h2>`;
          } else if (line.startsWith("### ")) {
            if (inUnorderedList) { html += "</ul>"; inUnorderedList = false; }
            if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
            html += `<h3>${line.substring(4)}</h3>`;
          } else if (line.match(/^[-*+] (.+)$/)) {
            if (!inUnorderedList) { html += "<ul>"; inUnorderedList = true; }
            html += `<li>${line.replace(/^[-*+] /, "")}</li>`;
            if (i === lines.length - 1 || !lines[i + 1]?.trim().match(/^[-*+] (.+)$/)) {
              html += "</ul>";
              inUnorderedList = false;
            }
          } else if (line.match(/^\d+\. (.+)$/)) {
            if (!inOrderedList) { html += "<ol>"; inOrderedList = true; }
            html += `<li>${line.replace(/^\d+\. /, "")}</li>`;
            if (i === lines.length - 1 || !lines[i + 1]?.trim().match(/^\d+\. (.+)$/)) {
              html += "</ol>";
              inOrderedList = false;
            }
          } else {
            // Corrected bold and italic parsing
            line = line.replace(/\*\*(.*?)\*\*/gs, "<strong>$1</strong>");
            line = line.replace(/__(.*?)__/gs, "<strong>$1</strong>");
            line = line.replace(/\*(.*?)\*/g, "<em>$1</em>");
            line = line.replace(/_(.*?)_/g, "<em>$1</em>");
      
            html += `<p>${line}</p>`;
          }
        }
      
        // Close any open lists at the end
        if (inUnorderedList) html += "</ul>";
        if (inOrderedList) html += "</ol>";
      
        return html;
      }

// Function to get response from Gemini API
async function getGeminiResponse(userMessage, imageBase64 = null) {
  const requestData = {
    contents: [{
      parts: []
    }]
  };

  // Add text part if exists
  if (userMessage) {
    requestData.contents[0].parts.push({ text: userMessage });
  }

  // Add image part if exists
  if (imageBase64) {
    requestData.contents[0].parts.push({
      inline_data: {
        mime_type: getMimeType(fileInput.files[0]),
        data: imageBase64.split(',')[1] // Remove the data URL prefix
      }
    });
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "No response received from the AI.";
    }
  } catch (error) {
    console.error("Error:", error);
    return `Sorry, I encountered an error: ${error.message}`;
  }
}

// Helper function to get MIME type
function getMimeType(file) {
  if (file.type.match('image.*')) {
    return file.type;
  }
  return 'image/jpeg'; // default
}

// Main send message function
async function sendMessage() {
  const message = userInput.value.trim();
  const file = fileInput.files[0];
  
  if (!message && !file) return;

  // Display user message/image
  if (message) addMessage(message, true);
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      addMessage(event.target.result, true, true);
    };
    reader.readAsDataURL(file);
  }

  // Clear inputs and disable during processing
  userInput.value = "";
  userInput.disabled = true;
  sendButton.disabled = true;

  // Show typing indicator
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("message", "bot-message", "typing");
  typingIndicator.textContent = "AI is thinking...";
  chatMessages.appendChild(typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    let imageBase64 = null;
    if (file) {
      imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
      });
    }

    const botResponse = await getGeminiResponse(message, imageBase64);
    typingIndicator.remove();
    addMessage(botResponse, false);
  } catch (error) {
    typingIndicator.remove();
    addMessage(`Error: ${error.message}`, false);
  } finally {
    // Reset UI
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
    fileInput.value = "";
    imagePreview.innerHTML = "";
  }
}

// Image upload handling
selectBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.match('image.*')) {
    alert('Please select an image file (JPEG, PNG, etc.)');
    return;
  }

  // Display preview
  const reader = new FileReader();
  reader.onload = (event) => {
    imagePreview.innerHTML = `
      <div style="position: relative; display: inline-block;">
        <img src="${event.target.result}" style="max-width: 100px; margin-top: 10px; border-radius: 4px;">
        <button id="removeImage" style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;">×</button>
      </div>
    `;
    
    document.getElementById('removeImage').addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.value = "";
      imagePreview.innerHTML = "";
    });
  };
  reader.readAsDataURL(file);
});

// Event listeners
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});