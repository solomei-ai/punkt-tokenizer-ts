"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const convertPunktData_1 = __importDefault(require("./convertPunktData"));
const downloadSources_1 = __importDefault(require("./downloadSources"));
/**
 * Deletes a folder and all its contents.
 * Safely handles errors during deletion.
 *
 * @param folderPath - Path to the folder to be deleted
 */
const deleteFolderRecursive = (folderPath) => {
    try {
        if (fs_1.default.existsSync(folderPath)) {
            fs_1.default.rmSync(folderPath, { recursive: true, force: true });
        }
    }
    catch (error) {
        console.error(`Error deleting folder at ${folderPath}: ${error}`);
    }
};
/**
 * Sets up the environment by downloading NLTK Punkt data, converting it,
 * and then cleaning up the temporary data directory.
 *
 * @returns Promise that resolves when the setup process is complete
 */
const setup = () => __awaiter(void 0, void 0, void 0, function* () {
    const dataDir = yield (0, downloadSources_1.default)(true);
    (0, convertPunktData_1.default)(dataDir);
    deleteFolderRecursive(dataDir);
});
exports.default = setup;
