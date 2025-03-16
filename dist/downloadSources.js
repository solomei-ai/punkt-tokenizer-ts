import * as AdmZip from "adm-zip";
import axios from "axios";
import fs from "node:fs";
import path from "node:path";
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
async function cloneNLTKPunktData(reset = true) {
    const sourceDataUrl = "https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/tokenizers/punkt_tab.zip";
    const dataDir = "src_data";
    if (fs.existsSync(dataDir)) {
        if (fs.readdirSync(dataDir).length > 0 && !reset) {
            console.error("src_data folder is not empty. Use reset=true to wipe folder content.");
            return dataDir;
        }
        else if (reset) {
            for (const file of fs.readdirSync(dataDir)) {
                const filePath = path.join(dataDir, file);
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }
            }
        }
    }
    else {
        fs.mkdirSync(dataDir);
    }
    try {
        const response = await axios.get(sourceDataUrl, {
            responseType: "arraybuffer",
        });
        const zip = new AdmZip.default(Buffer.from(response.data));
        zip.extractAllTo(dataDir, true);
        // delete readme.md
        const readmePath = path.join(dataDir, "README.md");
        if (fs.existsSync(readmePath)) {
            fs.unlinkSync(readmePath);
        }
        return dataDir;
    }
    catch (error) {
        console.error(`Failed to download or extract data: ${error}`);
        throw error;
    }
}
export default cloneNLTKPunktData;
