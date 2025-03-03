"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Converts abbrev_types.txt into an array of strings.
 * Ignores empty lines or lines containing only hyphens.
 *
 * @param filePath - Path to the abbrev_types.txt file
 * @returns Array of abbreviation types as strings
 */
function convertAbbrevTypes(filePath) {
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
function convertCollocations(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);
    const collocations = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || /^[-]+$/.test(trimmed))
            continue;
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
function convertOrthoContext(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);
    const context = {};
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || /^[-]+$/.test(trimmed))
            continue;
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
function convertSentStarters(filePath) {
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
function convertPunktData(dataDir) {
    const outDataDir = "parameters";
    if (!fs.existsSync(outDataDir)) {
        fs.mkdirSync(outDataDir);
    }
    const punktTabDir = path.join(dataDir, "punkt_tab");
    const languageDirs = fs
        .readdirSync(punktTabDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    const languageMap = require("./languageMap").default;
    for (const langDir of languageDirs) {
        const langLower = langDir.toLowerCase();
        if (!languageMap[langLower]) {
            console.warn(`Language "${langDir}" not found in language map, skipping.`);
            continue;
        }
        const langCode = languageMap[langLower];
        const langDirPath = path.join(punktTabDir, langDir);
        const punktData = {
            abbrevTypes: convertAbbrevTypes(path.join(langDirPath, "abbrev_types.txt")),
            collocations: convertCollocations(path.join(langDirPath, "collocations.tab")),
            orthoContext: convertOrthoContext(path.join(langDirPath, "ortho_context.tab")),
            sentStarters: convertSentStarters(path.join(langDirPath, "sent_starters.txt")),
        };
        const outputFile = path.join(outDataDir, `${langCode}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(punktData, null, 2), "utf8");
        console.log(`Converted ${langDir} (${langCode}) to: ${outputFile}`);
    }
}
exports.default = convertPunktData;
