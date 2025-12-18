import express, { type Request, type Response, type NextFunction } from "express";
import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import Papa from "papaparse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.static("dist"));

// Types
interface Card {
  id: string;
  initiative: string | number;
  cardName: string;
  tier: string;
  color: string;
  defense?: string;
  movement?: string;
  primaryValue?: string;
  actionType: string;
  rangeRadius?: string;
  cardText: string;
  itemIcon?: string;
}

interface Character {
  name: string;
  cardCount: number;
}

// Convert string to camelCase
function toCamelCase(str: string): string {
  return str
    .replace(/\s+/g, " ")
    .replace(/\//g, " ") // Convert slashes to spaces
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

// Convert CSV object keys to camelCase
function convertToCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    result[camelKey] = value;
  }
  return result;
}

// Load CSV data
function loadCharacterData(characterName: string): Card[] {
  const csvPath = resolve(__dirname, `characters/${characterName}.csv`);
  try {
    const csvContent = readFileSync(csvPath, "utf-8");
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    });
    return (
      ((parsed.data as unknown[]).map((obj) =>
        convertToCamelCase(obj as Record<string, unknown>)
      ) as unknown as Card[]) || []
    );
  } catch (error) {
    console.error(`Error loading ${characterName}.csv:`, error);
    return [];
  }
}

// Get all character names
function getCharacterNames(): Character[] {
  const charactersDir = resolve(__dirname, "characters");
  const files = readdirSync(charactersDir)
    .filter((file) => file.endsWith(".csv"))
    .map((file) => file.replace(".csv", ""));

  return files.map((name) => ({
    name,
    cardCount: loadCharacterData(name).length,
  }));
}

// API Routes

// Get list of all characters
app.get("/api/characters", (req: Request, res: Response) => {
  const characters = getCharacterNames();
  res.json(characters);
});

// Get abilities/cards for a specific character
app.get("/api/characters/:name", (req: Request, res: Response) => {
  const { name } = req.params;
  const cards = loadCharacterData(name);

  if (cards.length === 0) {
    return res.status(404).json({ error: `Character "${name}" not found` });
  }

  res.json({
    name,
    cardCount: cards.length,
    cards,
  });
});

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
