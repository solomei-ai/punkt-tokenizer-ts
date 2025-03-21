/// <reference types="jest" />
import { jest } from "@jest/globals";
import fs from "node:fs";
import { PunktTokenizer } from "../index.js";
describe("Language Support", () => {
    test("should properly resolve language codes", () => {
        // access directly private methods
        const tokenizer = new PunktTokenizer();
        expect(tokenizer.resolveLanguageCode("French")).toBe("fr");
        expect(tokenizer.resolveLanguageCode("en")).toBe("en");
        expect(tokenizer.resolveLanguageCode("EN")).toBe("en");
        expect(tokenizer.resolveLanguageCode("english")).toBe("en");
        expect(tokenizer.resolveLanguageCode("English")).toBe("en");
        expect(tokenizer.resolveLanguageCode("Italian")).toBe("it");
        expect(tokenizer.resolveLanguageCode("nonexistent")).toBe(undefined);
    });
    test("should list available languages", () => {
        const languages = PunktTokenizer.getAvailableLanguages();
        expect(Array.isArray(languages)).toBe(true);
        expect(languages.length).toBeGreaterThan(0);
        expect(languages).toContain("en");
    });
    test("should handle errors when getting available languages", () => {
        const originalExistsSync = fs.existsSync;
        const originalReaddirSync = fs.readdirSync;
        // typing for jest mock
        fs.existsSync = jest
            .fn()
            .mockReturnValue(false);
        const languages = PunktTokenizer.getAvailableLanguages();
        expect(languages).toEqual(["en"]);
        fs.existsSync = originalExistsSync;
        fs.readdirSync = originalReaddirSync;
    });
    // NOTE: check if more languages should be added to tests
    test("should tokenize text in different languages", () => {
        // English
        const enTokenizer = new PunktTokenizer("en");
        const enResult = enTokenizer.tokenize("Hello. How are you? I am fine!");
        expect(enResult).toHaveLength(3);
        // French
        const frTokenizer = new PunktTokenizer("fr");
        const frResult = frTokenizer.tokenize("Bonjour. Comment allez-vous? Je vais bien!");
        expect(frResult).toHaveLength(3);
        // Italian
        const itTokenizer = new PunktTokenizer("it");
        const itResult = itTokenizer.tokenize("Ciao. Come stai? Sto bene!");
        expect(itResult).toHaveLength(3);
    });
});
