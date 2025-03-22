/// <reference types="jest" />
import { jest } from "@jest/globals";
import { PunktTokenizer } from "../index.js";

describe("Abbreviation Handling", () => {
  const tokenizer = new PunktTokenizer("en");

  test("should not split on common abbreviations", () => {
    const result = tokenizer.tokenize(
      "Dr. Smith went to Washington D.C. He was happy."
    );
    expect(result).toHaveLength(2);
    expect(result[0].sentence).toBe("Dr. Smith went to Washington D.C.");
    expect(result[1].sentence).toBe("He was happy.");
  });

  test("should handle abbreviations at end of text", () => {
    const result = tokenizer.tokenize("He works at Google Inc.");
    expect(result).toHaveLength(1);
  });

  test("should handle abbreviations followed by sentence starters", () => {
    const result = tokenizer.tokenize(
      "She visited the U.S. The president greeted her."
    );
    expect(result).toHaveLength(2);
  });

  test("should cache abbreviation results for performance", () => {
    // spy private method
    const tokenizer = new PunktTokenizer("en");
    const isAbbreviationSpy = jest.spyOn(tokenizer as any, "isAbbreviation");

    // repeated abbreviations
    tokenizer.tokenize(
      "Dr. Smith and Dr. Jones both work at St. Mary hospital."
    );

    isAbbreviationSpy.mockClear();
    tokenizer.tokenize("Dr. Williams works with Dr. Miller.");
    const allCalls = isAbbreviationSpy.mock.calls.map((call) => call[0]);

    expect(allCalls).toContain("Dr");
    expect(allCalls).toContain("Miller");

    // cache limit
    expect(isAbbreviationSpy.mock.calls.length).toBeLessThan(10);

    isAbbreviationSpy.mockRestore();
  });

  test("should handle cache eviction when cache gets too large", () => {
    const tokenizer = new PunktTokenizer("en");

    // long text used to trigger cache eviction
    const longText = Array.from(
      { length: 1500 },
      (_, i) => `unique${i}. `
    ).join("");

    const cacheSpy = jest.spyOn((tokenizer as any)._cachedAbbreviations, "set");

    tokenizer.tokenize(longText);

    expect((tokenizer as any)._cachedAbbreviations.size).toBeLessThan(1500);

    cacheSpy.mockRestore();
  });
});
