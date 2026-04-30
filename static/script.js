async function sendMessage(customMessage = null) {

    let input = document.getElementById("userInput");
    let message = customMessage || input.value.trim();

    if (message === "") return;

    let chatBox = document.getElementById("chatBox");

    chatBox.innerHTML += `<p><b>You:</b> ${message}</p>`;

    input.value = "";

    const response = await fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: message })
    });

    const data = await response.json();

    chatBox.innerHTML += `<p><b>Bot:</b> ${data.reply}</p>`;
    chatBox.innerHTML += `<p><small>Practice Count: ${data.count}</small></p>`;
} 
function startListening() {

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = "en-US";

    recognition.onstart = function() {
        console.log("Listening...");
    };

    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;

        document.getElementById("userInput").value = text;

        sendMessage(); // auto send after speaking
    };

    recognition.onerror = function(event) {
        console.log("Speech error:", event.error);
        alert("Mic error: " + event.error);
    };

    recognition.start();
}

function quickSend(text){
    sendMessage(text);
}