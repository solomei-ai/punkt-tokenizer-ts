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
const AdmZip = __importStar(require("adm-zip"));
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
function cloneNLTKPunktData() {
    return __awaiter(this, arguments, void 0, function* (reset = true) {
        const sourceDataUrl = "https://raw.githubusercontent.com" +
            "/nltk/nltk_data/gh-pages/packages/tokenizers/punkt_tab.zip";
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
            const response = yield axios_1.default.get(sourceDataUrl, {
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
    });
}
exports.default = cloneNLTKPunktData;
