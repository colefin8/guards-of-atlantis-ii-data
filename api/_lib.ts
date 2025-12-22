import type { Card, Character, CharacterData } from "../types.js";

let charactersData: Record<string, Card[]> | null = null;
let spellsData: Card[] | null = null;

export async function loadCharactersData(): Promise<Record<string, Card[]>> {
  if (charactersData) return charactersData;

  try {
    const charactersUrl = "https://6qhgyijpbswffjr6.public.blob.vercel-storage.com/characters.json";
    const response = await fetch(charactersUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const jsonContent = await response.text();
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
    const spellsUrl = "https://6qhgyijpbswffjr6.public.blob.vercel-storage.com/gydion-spells.json";
    const response = await fetch(spellsUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const jsonContent = await response.text();
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
