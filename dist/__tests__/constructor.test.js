/// <reference types="jest" />
import { jest } from "@jest/globals";
import fs from "node:fs";
import { PunktTokenizer } from "../index.js";
describe("PunktTokenizer Constructor", () => {
    test("should initialize with default English model", () => {
        const tokenizer = new PunktTokenizer();
        expect(tokenizer).toBeInstanceOf(PunktTokenizer);
    });
    test("should initialize with specified language by code", () => {
        const tokenizer = new PunktTokenizer("de");
        expect(tokenizer).toBeInstanceOf(PunktTokenizer);
    });
    test("should initialize with specified language by name", () => {
        const tokenizer = new PunktTokenizer("italian");
        expect(tokenizer).toBeInstanceOf(PunktTokenizer);
    });
    test("should fall back to English when language not found", () => {
        const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {
        });
        const tokenizer = new PunktTokenizer("nonexistentlanguage");
        expect(warnSpy).toHaveBeenCalled();
        expect(tokenizer).toBeInstanceOf(PunktTokenizer);
        warnSpy.mockRestore();
    });
    test("should throw error when default model fails to load", () => {
        const originalReadFileSync = fs.readFileSync;
        fs.readFileSync = jest.fn().mockImplementation(() => {
            throw new Error("Simulated read error");
        });
        expect(() => new PunktTokenizer('it')).toThrow("Simulated read error");
        fs.readFileSync = originalReadFileSync;
    });
});
