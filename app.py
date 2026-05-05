from flask import Flask, request, jsonify
from openai import OpenAI
import os

app = Flask(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/chat', methods=['POST'])
def chat():
    messages = request.json.get("messages")

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an interview preparation assistant. Give clear, short answers."}
            ] + messages
        )

        reply = response.choices[0].message.content

    except Exception as e:
        reply = "Error: " + str(e)

    return jsonify({"reply": reply})