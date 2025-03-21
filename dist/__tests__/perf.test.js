/// <reference types="jest" />
import { jest } from "@jest/globals";
import { PunktTokenizer } from "../index.js";
describe('Performance and Memory', () => {
    test('should handle large texts efficiently', () => {
        const tokenizer = new PunktTokenizer();
        const paragraphs = Array.from({ length: 50 }, (_, i) => `This is paragraph ${i + 1}. It has multiple sentences. Each with different structures!`).join('\n\n');
        const startTime = performance.now();
        const results = tokenizer.tokenize(paragraphs);
        const endTime = performance.now();
        // 3 sentences × 50 paragraphs
        expect(results.length).toBe(150);
        // should complete in under 1 second
        expect(endTime - startTime).toBeLessThan(1000);
    });
    test('should clear caches between tokenization calls', () => {
        const tokenizer = new PunktTokenizer();
        const nextTokensClearSpy = jest.spyOn(tokenizer._cachedNextTokens, 'clear');
        const abbreviationsClearSpy = jest.spyOn(tokenizer._cachedAbbreviations, 'clear');
        tokenizer.tokenize('First text to tokenize.');
        expect(nextTokensClearSpy).toHaveBeenCalledTimes(1);
        expect(abbreviationsClearSpy).toHaveBeenCalledTimes(1);
        nextTokensClearSpy.mockRestore();
        abbreviationsClearSpy.mockRestore();
    });
});
