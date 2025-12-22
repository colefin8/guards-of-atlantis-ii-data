import { get } from "@vercel/blob";
import type { Card, Character, CharacterData } from "../types";

let charactersData: Record<string, Card[]> | null = null;
let spellsData: Card[] | null = null;

export async function loadCharactersData(): Promise<Record<string, Card[]>> {
  if (charactersData) return charactersData;

  try {
    const blob = await get("characters.json", { access: "public" });
    const jsonContent = await blob.text();
    charactersData = JSON.parse(jsonContent);
    return charactersData || {};
  } catch (error) {
    console.error("Error loading characters.json from Blob:", error);
    return {};
  }
}

export async function loadSpellsData(): Promise<Card[]> {
  if (spellsData) return spellsData;

  try {
    const blob = await get("gydion-spells.json", { access: "public" });
    const jsonContent = await blob.text();
    spellsData = JSON.parse(jsonContent);
    return spellsData || [];
  } catch (error) {
    console.error("Error loading gydion-spells.json from Blob:", error);
    return [];
  }
}

export async function getCharacterData(characterName: string): Promise<CharacterData> {
  const data = await loadCharactersData();
  const cards = data[characterName] || [];

  return {
    name: characterName,
    cardCount: cards.length,
    cards,
  };
}

export async function getCharacterNames(): Promise<Character[]> {
  const data = await loadCharactersData();
  return Object.keys(data).map((name) => ({
    name,
    cardCount: data[name].length,
  }));
}
