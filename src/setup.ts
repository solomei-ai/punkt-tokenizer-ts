import fs from "node:fs";
import convertPunktData from "./convertPunktData.js";
import cloneNLTKPunktData from "./downloadSources.js";

/**
 * Deletes a folder and all its contents.
 * Safely handles errors during deletion.
 *
 * @param folderPath - Path to the folder to be deleted
 */
const deleteFolderRecursive = (folderPath: string) => {
  try {
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }
  } catch (error) {
    console.error(`Error deleting folder at ${folderPath}: ${error}`);
  }
};

/**
 * Sets up the environment by downloading NLTK Punkt data, converting it,
 * and then cleaning up the temporary data directory.
 *
 * @returns Promise that resolves when the setup process is complete
 */
const setup = async () => {
  const dataDir = await cloneNLTKPunktData(true);
  convertPunktData(dataDir);
  deleteFolderRecursive(dataDir);
};

export default setup;
