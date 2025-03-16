import fs from "node:fs";
import path from "node:path";
import languageMap from "./languageMap.js";

/**
 * Represents a Punkt model converted to JSON format.
 */
interface PunktModel {
  /** List of abbreviation types */
  abbrevTypes: string[];
  /** Pairs of collocations */
  collocations: [string, string][];
  /** Mapping of tokens to their associated numbers */
  orthoContext: { [key: string]: number };
  /** List of sentence starter strings */
  sentStarters: string[];
}

/**
 * Represents a tokenized sentence with its position in the original text.
 */
export interface SentenceToken {
  /** The sentence text */
  sentence: string;
  /** Starting character position in the original text */
  start: number;
  /** Ending character position in the original text */
  end: number;
}

/**
 * A simplified implementation of the Punkt sentence tokenizer.
 * Loads a pre-converted JSON model and provides tokenization functionality.
 */
export class PunktTokenizer {
  private model: PunktModel;
  private static DEFAULT_LANGUAGE = "en";
  private static PARAMETERS_DIR = path.join(
      import.meta.dirname,
      "..",
      "parameters"
  );

  private _abbrevTypesSet: Set<string>;
  private _sentStartersSet: Set<string>;
  private _cachedNextTokens: Map<string, string | null> = new Map();
  private _cachedAbbreviations: Map<string, boolean> = new Map();

  private static boundaryRegex = /[.?!]+(?:\s+|$)/g;
  private static whitespaceRegex = /\s/;
  private static wordBoundaryRegex = /\s/;
  private static endPunctuationRegex = /[.?!]+$/;
  private static twoLetterLangCodeRegex = /^[a-z]{2}$/;

  /**
   * Creates a new PunktTokenizer instance.
   *
   * @param language - ISO 639-1 language code (e.g., 'en', 'fr', 'de')
   *                   or full language name (e.g., 'english', 'french')
   */
  constructor(language: string = PunktTokenizer.DEFAULT_LANGUAGE) {
    const langCode = this.resolveLanguageCode(language);
    const modelFilePath = path.join(
      PunktTokenizer.PARAMETERS_DIR,
      `${langCode}.json`
    );

    try {
      const fullPath = path.resolve(modelFilePath);
      this.model = JSON.parse(fs.readFileSync(fullPath, "utf-8")) as PunktModel;

      this._abbrevTypesSet = new Set(
        this.model.abbrevTypes.map((s) => s.toLowerCase())
      );
      this._sentStartersSet = new Set(
        this.model.sentStarters.map((s) => s.toLowerCase())
      );
    } catch (error) {
      console.warn(
        `Could not load model for language '${language}' (${langCode}), falling back to English.`
      );

      if (langCode !== PunktTokenizer.DEFAULT_LANGUAGE) {
        const defaultModelPath = path.join(
          PunktTokenizer.PARAMETERS_DIR,
          `${PunktTokenizer.DEFAULT_LANGUAGE}.json`
        );
        const fullPath = path.resolve(defaultModelPath);
        this.model = JSON.parse(fs.readFileSync(fullPath, "utf-8")) as PunktModel;
        this._abbrevTypesSet = new Set(
          this.model.abbrevTypes.map((s) => s.toLowerCase())
        );
        this._sentStartersSet = new Set(
          this.model.sentStarters.map((s) => s.toLowerCase())
        );
      } else {
        throw new Error(`Failed to load default English model: ${error}`);
      }
    }
  }

  /**
   * Resolves a language name or code to its ISO 639-1 code.
   *
   * @param language - Language name or code
   * @returns ISO 639-1 language code
   */
  private resolveLanguageCode(language: string): string {
    if (PunktTokenizer.twoLetterLangCodeRegex.test(language.toLowerCase())) {
      return language.toLowerCase();
    }

    try {
      const langLower = language.toLowerCase();
      return languageMap[langLower];
    } catch (error) {
      console.warn(`Could not load language map: ${error}`);
    }

    return PunktTokenizer.DEFAULT_LANGUAGE;
  }

  /**
   * Checks if a token is an abbreviation according to the loaded model.
   *
   * @param token - The token to check
   * @returns True if the token is an abbreviation, false otherwise
   */
  private isAbbreviation(token: string): boolean {
    const lowerToken = token.toLowerCase();

    if (this._cachedAbbreviations.has(lowerToken)) {
      return this._cachedAbbreviations.get(lowerToken)!;
    }

    if (this._cachedAbbreviations.size > 1000) {
      const keysToDelete = Array.from(this._cachedAbbreviations.keys()).slice(
        0,
        500
      );
      for (const key of keysToDelete) {
        this._cachedAbbreviations.delete(key);
      }
    }

    const result = this._abbrevTypesSet.has(lowerToken);
    this._cachedAbbreviations.set(lowerToken, result);
    return result;
  }

  /**
   * Checks if a token is a sentence starter according to the loaded model.
   *
   * @param token - The token to check
   * @returns True if the token is a sentence starter, false otherwise
   */
  private isSentenceStarter(token: string): boolean {
    return this._sentStartersSet.has(token.toLowerCase());
  }

  /**
   * Gets the next token in the text starting from the given index.
   *
   * @param text - The text to search in
   * @param index - The starting index for the search
   * @returns The next token found, or null if no token is found
   */
  private getNextToken(text: string, index: number): string | null {
    const cacheKey = `${index}`;
    if (this._cachedNextTokens.has(cacheKey)) {
      return this._cachedNextTokens.get(cacheKey)!;
    }

    if (this._cachedNextTokens.size > 1000) {
      const keysToDelete = Array.from(this._cachedNextTokens.keys()).slice(
        0,
        500
      );
      for (const key of keysToDelete) {
        this._cachedNextTokens.delete(key);
      }
    }

    const textLength = text.length;
    let i = index;

    while (i < textLength && PunktTokenizer.whitespaceRegex.test(text[i])) {
      i++;
    }

    if (i >= textLength) {
      this._cachedNextTokens.set(cacheKey, null);
      return null;
    }

    let end = i;
    while (
      end < textLength &&
      !PunktTokenizer.wordBoundaryRegex.test(text[end])
    ) {
      end++;
    }

    const token = text.substring(i, end);
    this._cachedNextTokens.set(cacheKey, token);
    return token;
  }

  /**
   * Determines whether a potential sentence boundary should be considered a true boundary.
   *
   * @param text - The text being tokenized
   * @param lastIndex - The index of the last confirmed sentence boundary
   * @param boundaryIndex - The index of the potential sentence boundary
   * @param boundaryLength - The length of the boundary marker (e.g., "." or "?!")
   * @returns True if the boundary should be considered a sentence split point, false otherwise
   */
  private shouldSplit(
    text: string,
    lastIndex: number,
    boundaryIndex: number,
    boundaryLength: number
  ): boolean {
    if (boundaryIndex <= lastIndex) return false;

    const beforeText = text.substring(lastIndex, boundaryIndex);
    const lastWordStart = beforeText.lastIndexOf(" ") + 1;
    const lastWord = beforeText.substring(lastWordStart);

    const cleanedLastWord = lastWord.replace(
      PunktTokenizer.endPunctuationRegex,
      ""
    );
    if (!cleanedLastWord) return false;

    if (this.isAbbreviation(cleanedLastWord)) {
      const nextToken = this.getNextToken(text, boundaryIndex + boundaryLength);
      return nextToken ? this.isSentenceStarter(nextToken) : false;
    }

    const nextToken = this.getNextToken(text, boundaryIndex + boundaryLength);

    if (!nextToken) return true;

    if (this.isSentenceStarter(nextToken)) {
      return true;
    }

    return true;
  }

  /**
   * Tokenizes text into sentences using the Punkt algorithm.
   *
   * @param text - The text to tokenize into sentences
   * @returns An array of SentenceToken objects, each containing a sentence and its position
   */
  tokenize(text: string): SentenceToken[] {
    this._cachedNextTokens.clear();
    this._cachedAbbreviations.clear();

    const tokens: SentenceToken[] = [];
    PunktTokenizer.boundaryRegex.lastIndex = 0;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    const textLength = text.length;

    const estimatedSentenceCount = Math.max(1, Math.ceil(textLength / 150));

    const tempSentence: SentenceToken = { sentence: "", start: 0, end: 0 };

    while ((match = PunktTokenizer.boundaryRegex.exec(text)) !== null) {
      const boundaryIndex = match.index;
      const boundaryLength = match[0].length;

      if (boundaryIndex === 0) {
        lastIndex = boundaryLength;
        continue;
      }

      if (!this.shouldSplit(text, lastIndex, boundaryIndex, boundaryLength)) {
        continue;
      }

      let start = lastIndex;
      let end = boundaryIndex + boundaryLength;

      while (start < end && PunktTokenizer.whitespaceRegex.test(text[start])) {
        start++;
      }

      while (
        end > start &&
        PunktTokenizer.whitespaceRegex.test(text[end - 1])
      ) {
        end--;
      }

      if (start < end) {
        tokens.push({
          sentence: text.substring(start, end),
          start,
          end,
        });
      }

      lastIndex = boundaryIndex + boundaryLength;
    }

    if (lastIndex < textLength) {
      let start = lastIndex;
      let end = textLength;

      while (start < end && PunktTokenizer.whitespaceRegex.test(text[start])) {
        start++;
      }

      while (
        end > start &&
        PunktTokenizer.whitespaceRegex.test(text[end - 1])
      ) {
        end--;
      }

      if (start < end) {
        tokens.push({
          sentence: text.substring(start, end),
          start,
          end,
        });
      }
    }

    return tokens;
  }

  /**
   * Returns a list of available language models.
   *
   * @returns Array of available language codes
   */
  static getAvailableLanguages(): string[] {
    try {
      const parametersDir = path.resolve(PunktTokenizer.PARAMETERS_DIR);
      if (!fs.existsSync(parametersDir)) {
        return [PunktTokenizer.DEFAULT_LANGUAGE];
      }

      return fs
        .readdirSync(parametersDir)
        .filter((file) => file.endsWith(".json"))
        .map((file) => path.basename(file, ".json"));
    } catch (error) {
      console.warn(`Error getting available languages: ${error}`);
      return [PunktTokenizer.DEFAULT_LANGUAGE];
    }
  }
}

export default PunktTokenizer;
