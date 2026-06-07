# AI Resume Analyzer + ATS Score Checker

Analyze resumes with Google Gemini AI. Google login, OTP email registration, section-wise feedback, PDF preview, and resume editing.

## Features

- Google Sign-In + email/password with OTP verification
- ATS score, keywords, spelling errors, section-wise analysis
- Split results view: issues on left, resume PDF on right
- Edit resume text, re-analyze, download original or edited PDF
- Dashboard with analysis history

## Setup

### 1. Google OAuth (Login)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a project → **Credentials** → **Create OAuth Client ID** → **Web application**
3. Add authorized JavaScript origins: `http://localhost:5173`
4. Copy the **Client ID**
5. Add to `server/.env` as `GOOGLE_CLIENT_ID`
6. Add to `client/.env` as `VITE_GOOGLE_CLIENT_ID`

### 2. Gemini API (Analysis)

Get a free key at [Google AI Studio](https://aistudio.google.com/apikey) → add as `GEMINI_API_KEY` in `server/.env`

### 3. Email OTP (Optional)

For real OTP emails, configure SMTP in `server/.env`.  
Without SMTP, OTP is printed in the **server console** during development.

### 4. Run

```bash
# Server
cd server
npm install
cp .env.example .env   # edit with your keys
npm run dev

# Client
cd client
npm install
cp .env.example .env   # add VITE_GOOGLE_CLIENT_ID
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Registration Flow

1. User fills name, email, password → **Send Verification Code**
2. OTP sent to email (or shown in server console in dev)
3. User enters OTP → account created and logged in

## Results Page

After analysis from Dashboard, you are redirected to `/results/:id`:

| Left panel | Right panel |
|------------|-------------|
| ATS scores, tabs (Overview, Keywords, Spelling, Sections, Improve) | PDF preview |
| | Edit resume text |
| | Download original / edited PDF |
