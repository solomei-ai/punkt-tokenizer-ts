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
export declare class PunktTokenizer {
    private model;
    private static DEFAULT_LANGUAGE;
    private static PARAMETERS_DIR;
    private _abbrevTypesSet;
    private _sentStartersSet;
    private _cachedNextTokens;
    private _cachedAbbreviations;
    private static boundaryRegex;
    private static whitespaceRegex;
    private static wordBoundaryRegex;
    private static endPunctuationRegex;
    private static twoLetterLangCodeRegex;
    /**
     * Creates a new PunktTokenizer instance.
     *
     * @param language - ISO 639-1 language code (e.g., 'en', 'fr', 'de')
     *                   or full language name (e.g., 'english', 'french')
     */
    constructor(language?: string);
    /**
     * Resolves a language name or code to its ISO 639-1 code.
     *
     * @param language - Language name or code
     * @returns ISO 639-1 language code
     */
    private resolveLanguageCode;
    /**
     * Checks if a token is an abbreviation according to the loaded model.
     *
     * @param token - The token to check
     * @returns True if the token is an abbreviation, false otherwise
     */
    private isAbbreviation;
    /**
     * Checks if a token is a sentence starter according to the loaded model.
     *
     * @param token - The token to check
     * @returns True if the token is a sentence starter, false otherwise
     */
    private isSentenceStarter;
    /**
     * Gets the next token in the text starting from the given index.
     *
     * @param text - The text to search in
     * @param index - The starting index for the search
     * @returns The next token found, or null if no token is found
     */
    private getNextToken;
    /**
     * Determines whether a potential sentence boundary should be considered a true boundary.
     *
     * @param text - The text being tokenized
     * @param lastIndex - The index of the last confirmed sentence boundary
     * @param boundaryIndex - The index of the potential sentence boundary
     * @param boundaryLength - The length of the boundary marker (e.g., "." or "?!")
     * @returns True if the boundary should be considered a sentence split point, false otherwise
     */
    private shouldSplit;
    /**
     * Tokenizes text into sentences using the Punkt algorithm.
     *
     * @param text - The text to tokenize into sentences
     * @returns An array of SentenceToken objects, each containing a sentence and its position
     */
    tokenize(text: string): SentenceToken[];
    /**
     * Returns a list of available language models.
     *
     * @returns Array of available language codes
     */
    static getAvailableLanguages(): string[];
}
export default PunktTokenizer;
