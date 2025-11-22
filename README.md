# First Flight Travels (Flask + i18n)

A light-blue themed travel landing page with English/Arabic i18n, RTL support, and a Flask backend that delivers contact form submissions via email.

## Project Structure

```
first-flight/
├── app.py
├── Procfile
├── requirements.txt
├── README.md
├── static/
│   ├── css/
│   │   └── style.css
│   ├── img/
│   ├── js/
│   │   ├── i18n.js
│   │   └── main.js
│   └── translations/
│       ├── ar.json
│       └── en.json
└── templates/
    └── index.html
```

## Setup & Run (Local PC)

1. **Install dependencies**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\\Scripts\\activate
   pip install -r requirements.txt
   ```
2. **Configure email environment variables** (example uses TLS SMTP):
   ```bash
   export MAIL_SERVER=smtp.gmail.com
   export MAIL_PORT=587
   export MAIL_USE_TLS=true
   export MAIL_USERNAME=your_email@example.com
   export MAIL_PASSWORD=your_app_password
   export MAIL_DEFAULT_SENDER=your_email@example.com
   export MAIL_RECIPIENT=destination@example.com  # where messages are sent
   ```
3. **Run the Flask app**
   ```bash
   flask --app app --debug run
   # or
   python app.py
   ```
4. Open `http://127.0.0.1:5000` and test the form.

## Deployment (Render / similar free hosts)

1. **Push this repo to GitHub.**
2. **Create a new Render Web Service** (or similar):
   - Select your GitHub repo.
   - Environment: `Python 3`.
   - Build command: `pip install -r requirements.txt`.
   - Start command: `gunicorn app:app`.
   - Set environment variables (`MAIL_SERVER`, `MAIL_PORT`, `MAIL_USE_TLS`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_DEFAULT_SENDER`, `MAIL_RECIPIENT`).
3. **Auto-deploy on commits**: Enable automatic deploys from your main branch.
4. **Test** the live URL by submitting the contact form.

### Heroku notes (if preferred)
- Add a free Postmark/SMTP provider for outgoing mail.
- Commands after installing the Heroku CLI:
  ```bash
  heroku create first-flight-travels
  heroku config:set MAIL_SERVER=smtp.sendgrid.net MAIL_PORT=587 MAIL_USE_TLS=true \
    MAIL_USERNAME=apikey MAIL_PASSWORD=your_sendgrid_key MAIL_DEFAULT_SENDER=from@example.com MAIL_RECIPIENT=to@example.com
  git push heroku main
  ```

## i18n Notes
- Language switcher (EN/AR) loads JSON dictionaries from `static/translations/`.
- RTL is toggled by setting `dir="rtl"` on `<html>` when Arabic is active.
- All translatable text uses `data-i18n` keys mapped in the JSON files.

## Contact Form Flow
- Frontend sends `POST /contact` with JSON `{ name, email, message }`.
- Flask uses `Flask-Mail` to deliver the email to `MAIL_RECIPIENT` (falls back to `MAIL_USERNAME`).
- Responses are JSON so the UI can show success/error without reloading.

## Security Tips
- Use app-specific passwords or provider tokens for SMTP.
- Do **not** commit real credentials. Use environment variables everywhere.
- Configure trusted sender/recipient addresses to avoid spam filtering.
