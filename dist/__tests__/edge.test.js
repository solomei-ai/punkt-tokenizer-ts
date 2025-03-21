import { PunktTokenizer } from "../index.js";
describe('Edge Cases', () => {
    const tokenizer = new PunktTokenizer();
    test('should handle empty text', () => {
        const result = tokenizer.tokenize('');
        expect(result).toHaveLength(0);
    });
    test('should handle text with no sentence boundaries', () => {
        const result = tokenizer.tokenize('This is just one sentence without any periods or other punctuation');
        expect(result).toHaveLength(1);
    });
    test('should handle text with only whitespace', () => {
        const result = tokenizer.tokenize('   \t   \n   ');
        expect(result).toHaveLength(0);
    });
    test('should handle text with multiple consecutive punctuation marks', () => {
        const result = tokenizer.tokenize('Is this real?! I can\'t believe it...');
        expect(result).toHaveLength(2);
    });
    test('should handle very long sentences', () => {
        const longSentence = 'This is a very long sentence '.repeat(100) + '.';
        const result = tokenizer.tokenize(longSentence);
        expect(result).toHaveLength(1);
    });
    test('should handle text with only punctuation', () => {
        const result = tokenizer.tokenize('...');
        expect(result).toHaveLength(0);
    });
    test('should handle text starting with punctuation', () => {
        const result = tokenizer.tokenize('. This starts with a period.');
        expect(result).toHaveLength(1);
        expect(result[0].sentence).toBe('This starts with a period.');
    });
});
