const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");

dotenv.config();

const PORT = process.env.PORT || 8787;
const app = express();
const corsOptions = {
  origin: true, // Or explicitly: ["https://kjsim-chatbot.netlify.app"]
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.warn(
    "[server] GOOGLE_GENERATIVE_AI_API_KEY is missing. Set it in .env (needed for embeddings)"
  );
}

if (!process.env.GROQ_API_KEY) {
  console.warn(
    "[server] GROQ_API_KEY is missing. Set it in .env (needed for chat)"
  );
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const kbDir = path.join(__dirname, "data");

let KB = [];
let KB_WITH_EMBEDS = [];
let EMBED_DIM = 0;

function cosineSim(a, b) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1;
  return dot / denom;
}

// async function embedText(text) {
//   const embedModel = genAI.getGenerativeModel({ model: "embedding-001" });
//   const r = await embedModel.embedContent(text);
//   const v = r.embedding.values;
//   if (!EMBED_DIM) EMBED_DIM = v.length;
//   return v;
// }

async function embedText(text) {
  try {
    const embedModel = genAI.getGenerativeModel({
      model: "gemini-embedding-001",
    });

    const r = await embedModel.embedContent(text);
    const v = r.embedding.values;

    if (!EMBED_DIM) EMBED_DIM = v.length;
    return v;
  } catch (e) {
    console.error("Embedding failed:", e.message);
    return new Array(EMBED_DIM || 768).fill(0);
  }
}


function normalizeAudience(a) {
  if (a == null) return [];
  if (Array.isArray(a)) return a.map((x) => String(x).toLowerCase());
  const s = String(a).toLowerCase();
  return s === "all" ? ["all"] : [s];
}

async function loadKb() {
  try {
    const files = fs.readdirSync(kbDir).filter((f) => f.endsWith(".json"));
    KB = [];
    KB_WITH_EMBEDS = [];

    for (const file of files) {
      const raw = fs.readFileSync(path.join(kbDir, file), "utf-8");
      const parsed = JSON.parse(raw);

      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        const audience = normalizeAudience(item.audience);
        const text = `${item.title}\n${item.tags?.join(", ") || ""}\n${
          item.content
        }`;
        const vec = await embedText(text);
        KB_WITH_EMBEDS.push({
          ...item,
          id: item.id ?? `${file}-${i + 1}`,
          audience,
          vector: vec,
        });
        KB.push(item);
      }
    }

    console.log(
      `[server] KB loaded with ${KB.length} items from ${files.length} files (dim=${EMBED_DIM})`
    );
  } catch (e) {
    console.error("[server] Failed to load KB:", e.message);
  }
}

function retrieve(queryVec, audience = "guest", k = 5) {
  const aud = String(audience).toLowerCase();

  const pool = KB_WITH_EMBEDS.filter((it) => {
    if (aud === "all") return true;
    if (!it.audience || it.audience.length === 0) return true;
    if (it.audience.includes("all")) return true;
    return it.audience.includes(aud);
  });

  const scored = pool.map((it) => ({
    item: it,
    score: cosineSim(queryVec, it.vector),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((s) => s.item);
}

function buildPrompt({ question, audience, contexts }) {
  const contextText = contexts
    .map((c, i) => `# Reference ${i + 1}: ${c.title}\n${c.content}`)
    .join("\n\n");

  return `
You are an institutional assistant for an academic institution KJSIM (Kj Somaiya Institute of Management).

Your role:
- Answer questions for the given audience: **${audience}**.
- Use ONLY the information provided in the "CONTEXT". 
- If the answer is not in the context, respond with:
  "I don't have that information in my knowledge base."

How to respond:
- Provide a **clear, detailed, and well-structured explanation**.
- Break down policies, rules, or procedures in a way that any person (student, faculty, staff, or visitor) can easily understand.
- Use simple, professional, and approachable language.
- When the question relates to a policy, rule, or detailed process:
  - Summarize the policy.
  - Explain step by step how it works.
  - Highlight important dates, requirements, or exceptions.
  - Give examples if useful.
- Do NOT just give a short answer — elaborate fully so the user feels confident they understand.
- If relevant, add disclaimers (e.g., “Please confirm with the official office for the latest updates”).

---

CONTEXT:
${contextText}

---

QUESTION:
${question}

---

DETAILED RESPONSE:
`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, role = "guest" } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array required" });
    }
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser?.content) {
      return res.status(400).json({ error: "last user message required" });
    }

    const queryVec = await embedText(String(lastUser.content));
    const contexts = retrieve(queryVec, role, 10);

    const prompt = buildPrompt({
      question: lastUser.content,
      audience: role,
      contexts,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 1024,
    });
    const text =
      completion.choices[0]?.message?.content || "I could not generate a response.";

    return res.json({
      answer: text,
    });
  } catch (e) {
    console.error("[server] /api/chat error:", e);
    return res.status(500).json({ error: "Server error generating answer." });
  }
});

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.get("/api/keep-alive", (_, res) => {
  const currentTime = new Date().toISOString();
  console.log(`[keep-alive] Ping received at ${currentTime}`);
  res.status(200).json({
    status: "alive",
    message: "Server is awake",
    timestamp: currentTime,
  });
});

app.listen(PORT, async () => {
  // console.log(
  //   `[server] listening on https://custom-knowledgebase-chatbot-mini-project.onrender.com - env: ${
  //     process.env.NODE_ENV || "dev"
  //   }`
  // );
  console.log(
  `[server] listening on http://localhost:${PORT} - env: ${
    process.env.NODE_ENV || "dev"
  }`
);

  await loadKb();

  // 🔁 Start the keep-alive ping loop
//   const SELF_URL =
//     process.env.API_END_POINT ||
//     `https://custom-knowledgebase-chatbot-mini-project.onrender.com`.replace(
//       "http://",
//       "https://"
//     );

//   // local testing
//   const SELF_URL_2 =
//     process.env.API_END_POINT ||
//     `http://localhost:${PORT}`.replace("http://", "https://");

//   setInterval(async () => {
//     try {
//       console.log("⏰ Pinging keep-alive endpoint to keep server active...");
//       await axios.get(`${SELF_URL}/api/keep-alive`);
//     } catch (e) {
//       console.error("[Keep-Alive Ping Error]", e.message);
//     }
//   }, 3 * 60 * 1000);
 });

