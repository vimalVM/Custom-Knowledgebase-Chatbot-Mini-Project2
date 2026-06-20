# Custom Knowledgebase Chatbot (Mini Project)

This is a **custom knowledgebase chatbot** backend hosted on [Render.com](https://custom-knowledgebase-chatbot-mini-project.onrender.com).  
It is built using **Express.js** and integrates with **Groq API** (Llama 3.3 70B) for LLM chat and **Google Gemini API** for embeddings, to provide context-aware answers from a knowledge base.

---

## 🚀 Project Overview

- **Backend**: Express.js (Node.js)
- **Frontend**: Separate app (built with Vite + React + TailwindCSS)
- **Hosting**: Render.com (backend), frontend hosted separately
- **LLM Provider**: Groq (`llama-3.3-70b-versatile`)
- **Embeddings**: Google `text-embedding-004`
- **Knowledge Base**: JSON files stored in `/data` directory

The chatbot works by:

1. Loading knowledge base JSON files from `/data`.
2. Generating embeddings for all KB entries.
3. Accepting user queries via API (`/api/chat`).
4. Retrieving the most relevant KB entries (cosine similarity).
5. Passing the retrieved context + user query to Groq (Llama 3.3 70B).
6. Returning an answer.

---

## Live Demo

Backend (Express, hosted on Render):  
🔗 [https://custom-knowledgebase-chatbot-mini-project.onrender.com](https://custom-knowledgebase-chatbot-mini-project.onrender.com)

---

## 📂 Project Structure

```

custom-knowledgebase-chatbot-mini-project/
│
├── data/ # Knowledge base JSON files
│ ├── kb1.json
│ ├── kb2.json
│ └── ...
│
├── index.js # 🚀 Main Express backend (used on Render)
├── package.json
├── .env # API key + config
│
├── api/ # (Next.js style API - not currently in use)
│ └── chat/
│ └── route.jsx
│
└── lib/ # (Helpers for Next.js version - not used in Express)
├── embeddings.ts
├── kb.ts
└── types.ts

```

Currently, only **`index.js` + /data** are required for Render backend.
The **Next.js files (`api/chat/route.jsx` + `/lib`)** are kept for future use, but not active in production.

---

### Chat Endpoint

```http
POST /api/chat
```

#### Request Body:

```json
{
  "messages": [
    { "role": "user", "content": "When is the admission deadline?" }
  ],
  "role": "student"
}
```

- `messages`: Chat history (we mainly use the latest user message).
- `role`: Target audience (e.g., `"student"`, `"faculty"`, or `"all"`).

#### Response:

```json
{
  "answer": "Fall Term early action is due Nov 1, and regular decision is due Jan 15."
}
```

---

## Knowledge Base Format

Each KB JSON file inside `/data` should follow this format:

```json
[
  {
    "id": 1,
    "question": "When is the admission deadline?",
    "answer": "Fall Term early action is due Nov 1, and regular decision is due Jan 15.",
    "audience": "student"
  },
  {
    "id": 2,
    "question": "What is the faculty meeting schedule?",
    "answer": "Faculty meetings are held on the first Monday of every month.",
    "audience": "faculty"
  }
]
```

- `audience` can be `"student"`, `"faculty"`, or `"all"`.
- If `"all"`, it will be included in retrieval regardless of role.

---

## Development Notes

- **Production**: Currently using **Express backend on Render**.
- **Next.js Version**:

  - `api/chat/route.jsx` + `/lib/*` contain an alternative Next.js implementation.
  - Not used right now, but kept for possible migration to Vercel/Next.js in future.

- **Embedding Strategy**:

  - On server startup, embeddings are generated for all KB items.
  - User queries are embedded and matched via cosine similarity.
  - Top 3 relevant KB entries are passed as context.

---
