import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCharacterData } from "../_lib";
import type { CharacterData } from "../../types";

export default function handler(req: VercelRequest, res: VercelResponse) {
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

  const cards = getCharacterData(characterName as string);

  if (cards.length === 0) {
    return res.status(404).json({ error: `Character "${characterName}" not found` });
  }

  const character: CharacterData = {
    name: characterName as string,
    cardCount: cards.length,
    cards,
  };

  res.status(200).json(character);
}
