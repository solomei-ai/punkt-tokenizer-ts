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
declare function convertPunktData(dataDir: string): void;
export default convertPunktData;
