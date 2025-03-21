import fs from "node:fs";
import path from "node:path";

/**
 * Converts abbrev_types.txt into an array of strings.
 * Ignores empty lines or lines containing only hyphens.
 *
 * @param filePath - Path to the abbrev_types.txt file
 * @returns Array of abbreviation types as strings
 */
function convertAbbrevTypes(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  return lines
    .map((line) => line.trim())
    .filter((line) => line && !/^[-]+$/.test(line));
}

/**
 * Converts collocations.tab into an array of [string, string] tuples.
 * Assumes columns are tab-separated.
 *
 * @param filePath - Path to the collocations.tab file
 * @returns Array of collocation pairs as [string, string] tuples
 */
function convertCollocations(filePath: string): Array<[string, string]> {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const collocations: Array<[string, string]> = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || /^[-]+$/.test(trimmed)) continue;
    const parts = trimmed.split(/\t/);
    if (parts.length >= 2) {
      collocations.push([parts[0].trim(), parts[1].trim()]);
    }
  }
  return collocations;
}

/**
 * Converts ortho_context.tab into an object mapping each token to its associated number.
 *
 * @param filePath - Path to the ortho_context.tab file
 * @returns Object with tokens as keys and their associated numbers as values
 */
function convertOrthoContext(filePath: string): { [key: string]: number } {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const context: { [key: string]: number } = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || /^[-]+$/.test(trimmed)) continue;
    const parts = trimmed.split(/\t/);
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parseInt(parts[1].trim(), 10);
      context[key] = value;
    }
  }
  return context;
}

/**
 * Converts sent_starters.txt into an array of strings (same logic as abbrev_types.txt).
 *
 * @param filePath - Path to the sent_starters.txt file
 * @returns Array of sentence starters as strings
 */
function convertSentStarters(filePath: string): string[] {
  return convertAbbrevTypes(filePath);
}

/**
 * Converts NLTK Punkt tokenizer data from the original format to JSON files.
 *
 * This function processes the Punkt tokenizer data for multiple languages,
 * converting the raw text and tab files into structured JSON files. It creates
 * an output directory structure and generates one JSON file per language,
 * using ISO 639-1 language codes as filenames.
 *
 * @param dataDir - Path to the directory containing the source Punkt data
 * @param outputFilePath - Path where the output should be stored (not currently used)
 *
 * @remarks
 * The function creates an 'out_data/parameters' directory structure and
 * stores JSON files with the following structure for each language:
 * - abbrevTypes: Array of abbreviation types
 * - collocations: Array of collocation pairs
 * - orthoContext: Object mapping tokens to their associated numbers
 * - sentStarters: Array of sentence starter strings
 */
function convertPunktData(dataDir: string) {
  const outDataDir = "parameters";

  if (!fs.existsSync(outDataDir)) {
    fs.mkdirSync(outDataDir);
  }

  const punktTabDir = path.join(dataDir, "punkt_tab");
  const languageDirs = fs
    .readdirSync(punktTabDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const languageMap = require("./language-map.js").default;

  for (const langDir of languageDirs) {
    const langLower = langDir.toLowerCase();

    if (!languageMap[langLower]) {
      console.warn(
        `Language "${langDir}" not found in language map, skipping.`
      );
      continue;
    }

    const langCode = languageMap[langLower];
    const langDirPath = path.join(punktTabDir, langDir);

    const punktData = {
      abbrevTypes: convertAbbrevTypes(
        path.join(langDirPath, "abbrev_types.txt")
      ),
      collocations: convertCollocations(
        path.join(langDirPath, "collocations.tab")
      ),
      orthoContext: convertOrthoContext(
        path.join(langDirPath, "ortho_context.tab")
      ),
      sentStarters: convertSentStarters(
        path.join(langDirPath, "sent_starters.txt")
      ),
    };

    const outputFile = path.join(outDataDir, `${langCode}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(punktData, null, 2), "utf8");
    console.log(`Converted ${langDir} (${langCode}) to: ${outputFile}`);
  }
}

export default convertPunktData;
