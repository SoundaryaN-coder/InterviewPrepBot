from flask import Flask, render_template, request, jsonify
import random
import os
import threading

app = Flask(__name__)

def speak(text):
    try:
        os.system(f'say "{text}"')
    except:
        pass

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    msg = data["message"].lower()

    hr_questions = [
        "Tell me about yourself",
        "Why should we hire you",
        "What are your strengths",
        "Where do you see yourself in five years"
    ]

    if "hr" in msg:
        reply = random.choice(hr_questions)

    elif "java" in msg:
        reply = "Explain OOP concepts in Java"

    elif "python" in msg:
        reply = "What is the difference between list and tuple"

    else:
        reply = "Good answer. Keep improving your communication"

    # Run voice in background (IMPORTANT)
    threading.Thread(target=speak, args=(reply,)).start()

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))