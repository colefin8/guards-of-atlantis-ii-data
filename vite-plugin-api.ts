import { readFileSync } from "fs";
import { resolve } from "path";
import type { ViteDevServer } from "vite";

interface Card {
  id: string
  initiative: string | number
  cardName: string
  tier: string
  color: string
  defense?: string
  movement?: string
  attack?: string
  actionType: string
  rangeRadius?: string
  cardText: string
  flavorText?: string
  itemIcon?: string
}

let charactersData: Record<string, Card[]> | null = null;
let spellsData: Card[] | null = null;

function loadCharactersData(): Record<string, Card[]> {
  if (charactersData) return charactersData;

  try {
    const jsonPath = resolve(process.cwd(), "public/data/characters.json");
    const jsonContent = readFileSync(jsonPath, "utf-8");
    charactersData = JSON.parse(jsonContent);
    return charactersData || {};
  } catch (error) {
    console.error("Error loading characters.json:", error);
    return {};
  }
}

function loadSpellsData(): Card[] {
  if (spellsData) return spellsData;

  try {
    const jsonPath = resolve(process.cwd(), "public/data/gydion-spells.json");
    const jsonContent = readFileSync(jsonPath, "utf-8");
    spellsData = JSON.parse(jsonContent);
    return spellsData || [];
  } catch (error) {
    console.error("Error loading gydion-spells.json:", error);
    return [];
  }
}

export function apiPlugin() {
  return {
    name: "api-plugin",
    configureServer(server: ViteDevServer) {
      // Use pre to run BEFORE other middlewares
      server.middlewares.use((req, res, next) => {
        const url = req.url || "";

        if (!url.startsWith("/api")) {
          return next();
        }

        // Enable CORS
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.statusCode = 200;
          res.end();
          return;
        }

        // Extract path without query string
        const path = url.split("?")[0];

        if (path === "/api/characters" && req.method === "GET") {
          const data = loadCharactersData();
          const characters = Object.keys(data).map((name) => ({
            name,
            cardCount: data[name].length,
          }));
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify(characters));
          return;
        }

        const characterMatch = path.match(/^\/api\/characters\/(.+)$/);
        if (characterMatch && req.method === "GET") {
          const characterName = decodeURIComponent(characterMatch[1]);
          const data = loadCharactersData();
          const cards = data[characterName] || [];

          if (cards.length === 0) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: `Character "${characterName}" not found` }));
            return;
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              name: characterName,
              cardCount: cards.length,
              cards,
            })
          );
          return;
        }

        if (path === "/api/spells" && req.method === "GET") {
          const spells = loadSpellsData();
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify(spells));
          return;
        }

        if (path === "/api/health" && req.method === "GET") {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify({ status: "ok" }));
          return;
        }

        next();
      });
    },
  };
}
