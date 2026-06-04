# AI Resume Analyzer + ATS Score Checker

Analyze resumes against a job description and get an ATS compatibility score, missing keywords, and improvement suggestions.

## Stack

- **Frontend:** React + Vite + Tailwind
- **Backend:** Node.js + Express + MongoDB
- **AI:** OpenAI API (GPT)

## Get an OpenAI API key

1. Sign in at [OpenAI Platform](https://platform.openai.com/).
2. Add billing/credits under **Settings → Billing** (API usage is pay-as-you-go).
3. Go to [API Keys](https://platform.openai.com/api-keys).
4. Click **Create new secret key**, copy it once (it starts with `sk-`).
5. Never commit the key to Git.

## Setup

### 1. Backend

```bash
cd server
npm install
```

Create `server/.env` from the example:

```bash
cp .env.example .env
```

Edit `server/.env` and set:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Random string for auth tokens |
| `OPENAI_API_KEY` | Your OpenAI secret key |
| `OPENAI_MODEL` | Optional: `gpt-4o-mini` (default) or `gpt-4o` |

Start the server:

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173` (or the port Vite prints).

## How ATS scoring works

1. Resume text is extracted from PDF or DOCX.
2. Keywords from the job description are matched locally (deterministic baseline).
3. OpenAI scores the resume using a fixed rubric (skills, experience, achievements, structure, ATS format).
4. Final **ATS score** blends AI score (65%) and keyword match (35%) for more stable, accurate results.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `OPENAI_API_KEY is missing` | Add key to `server/.env` and restart the server |
| `401` / invalid API key | Create a new key; check for extra spaces in `.env` |
| `insufficient_quota` | Add credits on OpenAI billing page |
| Low or random scores | Paste a full job description; use PDF/DOCX with selectable text |
