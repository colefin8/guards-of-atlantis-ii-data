import "dotenv/config";
import { config } from "dotenv";
import { resolve } from "path";
import { put } from "@vercel/blob";
import { readFileSync } from "fs";

// Load .env.local explicitly
config({ path: resolve(process.cwd(), ".env.local") });

async function uploadData() {
  try {
    const charactersPath = resolve(process.cwd(), "public/data/characters.json");
    const spellsPath = resolve(process.cwd(), "public/data/gydion-spells.json");

    const charactersContent = readFileSync(charactersPath, "utf-8");
    const spellsContent = readFileSync(spellsPath, "utf-8");

    console.log("Uploading characters.json to Vercel Blob...");
    const charsBlob = await put("characters.json", charactersContent, {
      access: "public",
      contentType: "application/json",
    });
    console.log("✓ characters.json uploaded:", charsBlob.url);

    console.log("Uploading gydion-spells.json to Vercel Blob...");
    const spellsBlob = await put("gydion-spells.json", spellsContent, {
      access: "public",
      contentType: "application/json",
    });
    console.log("✓ gydion-spells.json uploaded:", spellsBlob.url);

    console.log("\nAll data files uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error);
    process.exit(1);
  }
}

uploadData();
