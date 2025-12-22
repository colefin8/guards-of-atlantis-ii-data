import { readFileSync } from "fs";
import { resolve, join } from "path";
import type { Card, Character } from "../types";

let charactersData: Record<string, Card[]> | null = null;
let spellsData: Card[] | null = null;

function getDataPath(): string {
  // Try multiple possible paths for data files
  const possiblePaths = [
    // Vercel production: files are in the same deployment
    resolve(__dirname, "../public/data"),
    // Local development: public directory
    resolve(process.cwd(), "public/data"),
  ];

  for (const path of possiblePaths) {
    try {
      readFileSync(join(path, "characters.json"), "utf-8");
      return path;
    } catch {
      // Continue to next path
    }
  }

  console.error("Could not find data files in any path:", possiblePaths);
  // Fallback - will fail when trying to read but with better error message
  return possiblePaths[0];
}

export function loadCharactersData(): Record<string, Card[]> {
  if (charactersData) return charactersData;

  try {
    const dataPath = getDataPath();
    const jsonPath = join(dataPath, "characters.json");
    const jsonContent = readFileSync(jsonPath, "utf-8");
    charactersData = JSON.parse(jsonContent);
    return charactersData || {};
  } catch (error) {
    console.error("Error loading characters.json:", error);
    return {};
  }
}

export function loadSpellsData(): Card[] {
  if (spellsData) return spellsData;

  try {
    const dataPath = getDataPath();
    const jsonPath = join(dataPath, "gydion-spells.json");
    const jsonContent = readFileSync(jsonPath, "utf-8");
    spellsData = JSON.parse(jsonContent);
    return spellsData || [];
  } catch (error) {
    console.error("Error loading gydion-spells.json:", error);
    return [];
  }
}

export function getCharacterData(characterName: string): Card[] {
  const data = loadCharactersData();
  return data[characterName] || [];
}

export function getCharacterNames(): Character[] {
  const data = loadCharactersData();
  return Object.keys(data).map((name) => ({
    name,
    cardCount: data[name].length,
  }));
}
