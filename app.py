from flask import Flask, request, jsonify
from openai import OpenAI
import os

app = Flask(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("message")

    print("USER INPUT:", user_input)   # ADD THIS

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an interview preparation assistant. Give clear, short answers."},
                {"role": "user", "content": user_input}
            ]
        )

        reply = response.choices[0].message.content
        print("BOT REPLY:", reply)   # ADD THIS

    except Exception as e:
        reply = "Error: " + str(e)
        print("ERROR:", e)

    return jsonify({"reply": reply})