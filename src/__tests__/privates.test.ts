/// <reference types="jest" />
import { jest } from "@jest/globals";
import fs from "node:fs";
import { PunktTokenizer } from "../index.js";


describe('Private Methods', () => {
    test('should correctly identify sentence starters', () => {
        const tokenizer = new PunktTokenizer('en');
        expect((tokenizer as any).isSentenceStarter('The')).toBe(true);
        expect((tokenizer as any).isSentenceStarter('the')).toBe(true);
        expect((tokenizer as any).isSentenceStarter('THE')).toBe(true);
        // This depends on your specific model, adjust as needed
    });

    test('should correctly get the next token', () => {
        const tokenizer = new PunktTokenizer();
        expect((tokenizer as any).getNextToken('Hello world', 0)).toBe('Hello');
        expect((tokenizer as any).getNextToken('Hello world', 5)).toBe('world');
        expect((tokenizer as any).getNextToken('Hello world', 11)).toBeNull();

        // Test with leading whitespace
        expect((tokenizer as any).getNextToken('  Hello', 0)).toBe('Hello');
    });

    test('should handle caching in getNextToken', () => {
        const tokenizer = new PunktTokenizer();
        const text = 'This is a test';

        // Call once to cache
        (tokenizer as any).getNextToken(text, 5);

        // Create spy after first call
        const cacheSpy = jest.spyOn((tokenizer as any)._cachedNextTokens, 'get');

        // Call again
        (tokenizer as any).getNextToken(text, 5);

        // Verify cache was used
        expect(cacheSpy).toHaveBeenCalledWith('5');

        cacheSpy.mockRestore();
    });

    test('should properly determine split points', () => {
        const tokenizer = new PunktTokenizer();

        // Regular end of sentence
        expect((tokenizer as any).shouldSplit('This is a test. Next sentence.', 0, 14, 2)).toBe(true);

        // Split point before last index should return false
        expect((tokenizer as any).shouldSplit('Test.', 0, 0, 1)).toBe(false);

        // No word before punctuation
        expect((tokenizer as any).shouldSplit('Test .', 0, 5, 1)).toBe(false);
    });
});