// Store full conversation (memory)
let chatHistory = [];
let currentMode = "general";

// Send message function
async function sendMessage(customMessage = null) {

    let input = document.getElementById("userInput");
    let message = customMessage || input.value.trim();

    if (message === "") return;

    let chatBox = document.getElementById("chatBox");

    // Show user message
    chatBox.innerHTML += `<p><b>You:</b> ${message}</p>`;
    chatBox.innerHTML += `<p><b>You:</b> ${message}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;   // ✅ HERE
    input.value = "";

    // Add user message to history
    chatHistory.push({
        role: "user",
        content: message
    });
    chatBox.innerHTML += `<p id="loading"><i>Bot is typing...</i></p>`;
    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            messages: chatHistory,
            mode: currentMode
            })
        // send full history
        });
        document.getElementById("loading")?.remove();

        const data = await response.json();

        console.log("API RESPONSE:", data); // DEBUG

        // Show bot reply
        chatBox.innerHTML += `<p><b>Bot:</b> ${data.reply}</p>`;
        chatBox.innerHTML += `<p><b>Bot:</b> ${data.reply}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;   // ✅ HERE

        // Add bot reply to history
        chatHistory.push({
            role: "assistant",
            content: data.reply
        });

        // Auto scroll
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
    document.getElementById("loading")?.remove();
    console.log("Fetch error:", error);
    chatBox.innerHTML += `<p><b>Bot:</b> Server error. Try again.</p>`;
}


// 🎤 Voice input
function startListening() {

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = "en-US";

    recognition.onstart = function() {
        console.log("Listening...");
    };

    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;

        document.getElementById("userInput").value = text;

        sendMessage(); // auto send
    };

    recognition.onerror = function(event) {
        console.log("Speech error:", event.error);
        alert("Mic error: " + event.error);
    };

    recognition.start();
}


// ⚡ Quick buttons (HR / Technical / etc.)
function quickSend(text){
    currentMode = text;
    chatHistory = [];
    document.getElementById("chatBox").innerHTML = "";
    sendMessage("Start " + text + " interview");
}