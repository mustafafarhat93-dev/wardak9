import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client to avoid crashes if API key is not yet set
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in the environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint to talk to Gemini AI in Pashto about Afghanistan
app.post("/api/ask", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "پوښتنه خالي ده." });
    }

    const ai = getAIClient();
    
    // Custom system instructions guiding the model for expert Pashto responses on AFG
    const systemInstruction = 
      "تاسو د افغانستان په اړه یو خورا تکړه، پوه او باادبه لارښود (هوښیار پوهنغونډ مرستندوی) یاست. " +
      "ټول ځوابونه باید په درناوي ډک، په خورا روانه او معیاري پښتو ژبه وي. " +
      "کله چې کاروونکی پوښتنه کوي، هڅه وکړئ په معلوماتي، روښانه او فارمټ شویو جملو کې ځواب ورکړئ. " +
      "د لوستلو د اسانتیا لپاره له نښو (bullet points) او سرلیکونو (headers) په مناسب ډول کار واخلئ. " +
      "که داسې پوښتنه وشي چې له افغانستان، د افغانانو له تاریخ، کلتور، سیمو، ژبو، خوړو یا مشاهیرو سره تړاو نلري، پوه کړئ چې ستاسو مسؤلیت یوازې د افغانستان پوهنغونډ کې مرسته کول دي او په نرمۍ بښنه ورڅخه وغواړئ.";

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.role === "assistant" ? "model" : "user",
          parts: [{ text: turn.text }]
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "بښنه غواړم، په دې اړه معلومات پیدا نشول.";
    res.json({ reply });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ 
      error: "بښنه غواړم، د معلوماتو په راوړلو کې تخنیکي ستونزه پېښه شوه. مهرباني وکړئ بیا هڅه وکړئ." 
    });
  }
});

// Setup Vite Middleware in Dev, Static serve in Production
async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

setupApp();
