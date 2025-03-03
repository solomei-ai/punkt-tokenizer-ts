/**
 * Downloads NLTK Punkt tokenizer data from GitHub and stores it in the 'src_data'
 * folder.
 *
 * @param reset - If true, existing content in the 'src_data' folder
 *                will be deleted before downloading. If false and the
 *                folder is not empty, the function will exit without
 *                downloading. Defaults to true.
 * @returns The path to the directory where the data is stored.
 * @throws Will throw an error if the download request fails.
 */
declare function cloneNLTKPunktData(reset?: boolean): Promise<string>;
export default cloneNLTKPunktData;
//# sourceMappingURL=downloadSources.d.ts.map