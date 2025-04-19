

    const apiKey = "AIzaSyDg7nq6MpIxN8xWk9iB7kQ_T74w2fiFMxc"; // Replace with your actual API key
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDg7nq6MpIxN8xWk9iB7kQ_T74w2fiFMxc"; // Replace with the correct API URL

    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.querySelector('.chat-messages');
    const welcomeMessage = document.querySelector('.welcome-message');

    // Function to add a message to the chat
    function addMessage(text, isUser) {
      if (isUser && welcomeMessage.style.display !== 'none') {
        welcomeMessage.style.display = 'none';
      }

      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');
      messageDiv.textContent = isUser ? `You: ${text}` : `AI: ${text}`;
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to get a response from the Gemini API
    async function getGeminiResponse(userMessage) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', text: userMessage }]
          })
        });
        const data = await response.json();
        console.log("API Response:", data);
        return data.text || "No response received.";
      } catch (error) {
        console.error("Error with the Gemini API request:", error);
        return "Sorry, I couldn't process your request.";
      }
    }

    // Function to handle sending a message
    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;

      addMessage(message, true);
      userInput.value = '';
      userInput.disabled = true;
      sendButton.disabled = true;

      // Show typing indicator
      const typingIndicator = document.createElement('div');
      typingIndicator.classList.add('message', 'bot-message');
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
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });