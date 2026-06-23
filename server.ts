import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const DB_FILE = path.join(process.cwd(), "offers.json");

// Default offers to pre-populate the database
const DEFAULT_OFFERS = [
  {
    id: "specialty-coffee",
    title: "كوب قهوة مختصة مجانية",
    merchant: "مقهى السحاب (Cloud Cafe)",
    description: "احصل على كوب مجاني من القهوة المقطرة الباردة أو الحارة المحضرة بحبوب البن الإثيوبية الفاخرة. العرض صالح لمرة واحدة فقط.",
    category: "coffee",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    bgColor: "#1e1b4b", // deep indigo
    textColor: "#f8fafc",
    code: "COFFEE-CLD9",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    isUsed: false
  },
  {
    id: "iced-matcha",
    title: "كوب آيس ماتشا لاتيه",
    merchant: "بيت الماتشا (Matcha House)",
    description: "استمتع بمشروب الماتشا العضوي البارد مع الحليب الطازج ولمسة من الفانيليا المجانية. يسري هذا العرض لعملاء التطبيق الجدد.",
    category: "tea",
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=800",
    bgColor: "#064e3b", // deep forest green
    textColor: "#f0fdf4",
    code: "MATCHA-GRN2",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    isUsed: false
  },
  {
    id: "chocolate-croissant",
    title: "كرواسون شوكولاتة فرنسي",
    merchant: "مخبز لافندر (Lavender Bakery)",
    description: "كرواسون فرنسي مخبوز طازجاً، محشو بالشوكولاتة البلجيكية الغنية الدافئة. يُقدم مجاناً مع أي طلب آخر من المشروبات.",
    category: "dessert",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800",
    bgColor: "#4c1d95", // deep purple
    textColor: "#faf5ff",
    code: "CROIS-LAV5",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    isUsed: false
  }
];

// Load or initialize DB
function getOffers() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_OFFERS, null, 2), "utf-8");
      return DEFAULT_OFFERS;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return DEFAULT_OFFERS;
  }
}

function saveOffers(offers: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(offers, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// API Routes
app.get("/api/offers", (req, res) => {
  const offers = getOffers();
  res.json(offers);
});

app.get("/api/offers/:id", (req, res) => {
  const offers = getOffers();
  const offer = offers.find((o: any) => o.id === req.params.id);
  if (!offer) {
    return res.status(404).json({ error: "العرض غير موجود" });
  }
  res.json(offer);
});

app.post("/api/offers", (req, res) => {
  const { title, merchant, description, category, imageUrl, bgColor, textColor, expiresAt } = req.body;
  
  if (!title || !merchant || !description) {
    return res.status(400).json({ error: "الرجاء تعبئة الحقول الأساسية: العنوان، المتجر، والوصف" });
  }

  const offers = getOffers();
  
  // Generate random code and ID
  const id = "offer-" + Math.random().toString(36).substring(2, 11);
  const codeSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const categoryPrefix = (category || "offer").substring(0, 4).toUpperCase();
  const code = `${categoryPrefix}-${codeSuffix}`;

  const newOffer = {
    id,
    title,
    merchant,
    description,
    category: category || "other",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    bgColor: bgColor || "#1e293b",
    textColor: textColor || "#f8fafc",
    code,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isUsed: false
  };

  offers.push(newOffer);
  saveOffers(offers);
  res.status(201).json(newOffer);
});

app.get("/api/offers/:id/pkpass", (req, res) => {
  const offers = getOffers();
  const offer = offers.find((o: any) => o.id === req.params.id);
  if (!offer) {
    return res.status(404).json({ error: "العرض غير موجود" });
  }

  // Set headers for Apple Wallet Pass download
  res.setHeader("Content-Type", "application/vnd.apple.pkpass");
  res.setHeader("Content-Disposition", `attachment; filename="pass-${offer.id}.pkpass"`);

  // Create a mock pass buffer to trigger the device's default wallet installer handler
  const dummyPassBuffer = Buffer.from("MOCK_PKPASS_DATA_ZIP_FORMAT");
  res.send(dummyPassBuffer);
});

app.post("/api/offers/:id/redeem", (req, res) => {
  const offers = getOffers();
  const offerIndex = offers.findIndex((o: any) => o.id === req.params.id);
  
  if (offerIndex === -1) {
    return res.status(404).json({ error: "العرض غير موجود" });
  }

  if (offers[offerIndex].isUsed) {
    return res.status(400).json({ error: "تم استخدام هذا الكوبون مسبقاً!" });
  }

  offers[offerIndex].isUsed = true;
  offers[offerIndex].usedAt = new Date().toISOString();
  
  saveOffers(offers);
  res.json({ success: true, offer: offers[offerIndex] });
});

app.get("/api/config", (req, res) => {
  const host = req.get("host") || "";
  let protocol = "https";
  if (host.includes("localhost") || host.includes("127.0.0.1") || host.includes("0.0.0.0") || host.includes("3000")) {
    protocol = "http";
  }
  
  let publicHost = host;
  
  res.json({
    publicUrl: `${protocol}://${publicHost}`,
    host,
    publicHost
  });
});

// Start Express Server
async function startServer() {
  // Integrate Vite Dev Server in Non-Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Explicitly serve index.html with Vite's HTML transformation in development for all non-API paths
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith("/api/")) {
        return next();
      }
      try {
        const indexPath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
    console.log("Vite development middleware and HTML transform mounted.");
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

startServer();
