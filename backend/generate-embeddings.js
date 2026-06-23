/**
 * Pre-compute embeddings for all KB items and save to data/embeddings.json
 *
 * Usage:  node generate-embeddings.js
 *
 * This only needs to be re-run when the KB JSON files in data/ change.
 * The generated embeddings.json is committed to Git so the server
 * never has to call the Gemini embedding API on startup.
 */

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const EMBEDDING_MODEL = "gemini-embedding-001";
const DATA_DIR = path.join(__dirname, "data");
const OUTPUT_FILE = path.join(DATA_DIR, "embeddings.json");

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error("❌ GOOGLE_GENERATIVE_AI_API_KEY is not set in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

function normalizeAudience(a) {
  if (a == null) return [];
  if (Array.isArray(a)) return a.map((x) => String(x).toLowerCase());
  const s = String(a).toLowerCase();
  return s === "all" ? ["all"] : [s];
}

async function embedText(text) {
  const embedModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  const r = await embedModel.embedContent(text);
  return r.embedding.values;
}

async function main() {
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json") && f !== "embeddings.json");
  
  console.log(`📂 Found ${files.length} KB files in data/`);

  const results = [];
  let total = 0;

  for (const file of files) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
    const parsed = JSON.parse(raw);

    console.log(`  📄 Processing ${file} (${parsed.length} items)...`);

    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      const id = item.id ?? `${file}-${i + 1}`;
      const audience = normalizeAudience(item.audience);
      const text = `${item.title}\n${item.tags?.join(", ") || ""}\n${item.content}`;

      // Add a small delay between requests to avoid rate limiting
      if (total > 0 && total % 10 === 0) {
        console.log(`    ⏳ Pausing briefly to respect rate limits... (${total} done)`);
        await new Promise((r) => setTimeout(r, 1000));
      }

      const vector = await embedText(text);
      
      results.push({
        id,
        title: item.title,
        content: item.content,
        audience,
        tags: item.tags || [],
        vector,
      });

      total++;
    }
  }

  const dim = results[0]?.vector?.length || 0;

  // Save to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ dim, items: results }, null, 0));

  const fileSizeMB = (fs.statSync(OUTPUT_FILE).size / (1024 * 1024)).toFixed(2);
  
  console.log(`\n✅ Done! Generated embeddings for ${total} items (dim=${dim})`);
  console.log(`💾 Saved to: ${OUTPUT_FILE} (${fileSizeMB} MB)`);
  console.log(`\n📌 Next steps:`);
  console.log(`   1. git add backend/data/embeddings.json`);
  console.log(`   2. git commit -m "chore: pre-computed KB embeddings"`);
  console.log(`   3. git push`);
}

main().catch((e) => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});
