# Custom Knowledgebase Chatbot (Mini Project)

A full-stack RAG (Retrieval-Augmented Generation) chatbot application that answers questions based on a custom knowledge base. It uses a hybrid AI architecture for optimal performance and cost-efficiency.

## 🌟 Features
- **Hybrid AI Architecture:** Uses **Groq (Llama 3.3 70B)** for blazing-fast chat responses and **Google Gemini** for high-quality semantic embeddings.
- **Custom Knowledge Base:** Answers questions using provided JSON data files (policies, rules, schedules, etc.).
- **Role-Based Context:** Tailors responses based on the audience (student, faculty, staff, visitor).
- **Modern UI:** Built with React, Vite, TailwindCSS, and Radix UI components for a sleek, responsive chat interface.

## 🏗️ Tech Stack

### Frontend
- React 19 + Vite
- TailwindCSS 4
- Radix UI Primitives
- Lucide React Icons
- React Markdown (for rendering formatted responses)

### Backend
- Node.js & Express.js
- **LLM Provider:** Groq SDK (`llama-3.3-70b-versatile`)
- **Embeddings:** Google Generative AI (`gemini-embedding-001`)
- Cosine similarity matching for context retrieval

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- [Groq API Key](https://console.groq.com/) (Free)
- [Google AI Studio API Key](https://aistudio.google.com/) (Free)

### 1. Clone & Install
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 2. Environment Variables
You need `.env` files in both the root directory and the backend directory.

**Root Directory (`/.env.local`):**
Create a `.env.local` file for the frontend:
```env
VITE_API_BASE_URL=http://localhost:8787/api
```

**Backend Directory (`/backend/.env`):**
Create a `.env` file for the backend:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key_here
GROQ_API_KEY=your_groq_key_here
PORT=8787
```

### 3. Run the Development Servers

Start both servers in separate terminal windows:

**Start Backend (Port 8787):**
```bash
cd backend
npm start
```

**Start Frontend (Port 5173):**
```bash
# In the root directory
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🌐 Deployment

This project is configured for deployment on:
- **Frontend:** Netlify (or Vercel)
- **Backend:** Render.com

Make sure to set the respective environment variables in your hosting provider's dashboard:
- Frontend needs `VITE_API_BASE_URL` pointing to your deployed backend URL.
- Backend needs `GOOGLE_GENERATIVE_AI_API_KEY` and `GROQ_API_KEY`.

## 📁 Project Structure

```text
.
├── backend/                  # Express server & RAG logic
│   ├── data/                 # Knowledge base JSON files
│   ├── index.js              # Main server entry point
│   ├── package.json          
│   └── README.md             # Backend specific docs
├── src/                      # Frontend React code
│   ├── components/chat/      # UI components
│   ├── App.jsx               # Main React app
│   └── main.jsx              
├── index.html
├── package.json
└── vite.config.js
```
