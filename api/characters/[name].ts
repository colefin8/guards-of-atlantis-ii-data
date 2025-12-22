import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCharacterData } from "../_lib.js";
import type { CharacterData } from "../../types.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name } = req.query;
  const characterName = Array.isArray(name) ? name[0] : name;

  if (!characterName) {
    return res.status(400).json({ error: "Character name required" });
  }

  try {
    const character = await getCharacterData(characterName as string);

    if (character.cardCount === 0) {
      return res.status(404).json({ error: `Character "${characterName}" not found` });
    }

    res.status(200).json(character);
  } catch (error) {
    console.error(`Error in /api/characters/${characterName}:`, error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
