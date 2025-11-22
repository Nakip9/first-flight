from __future__ import annotations
import os
from flask import Flask, jsonify, render_template, request
from flask_mail import Mail, Message

app = Flask(__name__)

# Mail configuration from environment variables
app.config.update(
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_USE_TLS=os.getenv("MAIL_USE_TLS", "true").lower() == "true",
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_DEFAULT_SENDER=os.getenv("MAIL_DEFAULT_SENDER", os.getenv("MAIL_USERNAME")),
)

mail = Mail(app)


@app.route("/")
def home():
    return render_template("index.html")


@app.post("/contact")
def contact():
    data = request.get_json(force=True)
    name = data.get("name", "")
    email = data.get("email", "")
    message = data.get("message", "")

    if not (name and email and message):
        return jsonify({"success": False, "error": "Missing required fields."}), 400

    recipient = os.getenv("MAIL_RECIPIENT", os.getenv("MAIL_USERNAME"))
    if not recipient:
        return jsonify({"success": False, "error": "Email recipient is not configured."}), 500

    try:
        msg = Message(
            subject="First Flight Travels Contact",
            recipients=[recipient],
            body=f"Name: {name}\nEmail: {email}\n\n{message}",
            reply_to=email,
        )
        mail.send(msg)
        return jsonify({"success": True})
    except Exception as exc:  # pragma: no cover - logging only
        return jsonify({"success": False, "error": str(exc)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
