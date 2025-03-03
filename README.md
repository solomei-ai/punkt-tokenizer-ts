# Punkt Tokenizer for TypeScript

A TypeScript implementation of the Punkt sentence tokenizer, based on the **NLTK (Natural Language Toolkit)** implementation. This library provides efficient and accurate sentence boundary detection for multiple languages.

## Features

- **Multi-language Support**: Works with 19 languages out of the box
- **Pre-trained Models**: Uses NLTK's pre-trained Punkt models
- **Efficient Implementation**: Optimized for performance with caching mechanisms
- **Easy to Use API**: Simple interface for t dokenizing text into sentences
- **TypeScript Native**: Full TypeScript support with proper type definitions

## Installation ???

```bash
npm install punkt_tok
```

## Quick Start

```typescript
import { PunktTokenizer, setupPunkt } from 'punkt_tok';

// Optional: Run setup to download and prepare the models
// Only needed once or when updating models
async function initialize() {
  await setupPunkt();
  
  // Create a tokenizer (English is the default)
  const tokenizer = new PunktTokenizer();
  
  // Or specify a language
  const frenchTokenizer = new PunktTokenizer('fr');
  
  // Tokenize text into sentences
  const sentences = tokenizer.tokenize('Hello world. This is a test.');
  
  // Each sentence includes the text and its position in the original string
  sentences.forEach(sent => {
    console.log(`Sentence: ${sent.sentence}`);
    console.log(`Position: ${sent.start}-${sent.end}`);
  });
}

initialize();
```

## Supported Languages

The tokenizer supports all languages available in NLTK's Punkt models, including:

- English (en)
- French (fr)
- German (de)
- Italian (it)
- Spanish (es)
- Portuguese (pt)
- Dutch (nl)
- And many more...

You can use either the ISO 639-1 language code (e.g., 'en') or the full language name (e.g., 'english').

## API Reference

### PunktTokenizer

```typescript
// Create a new tokenizer
const tokenizer = new PunktTokenizer(language?: string);

// Tokenize text into sentences
const sentences = tokenizer.tokenize(text: string): SentenceToken[];

// Get available languages
const languages = PunktTokenizer.getAvailableLanguages(): string[];
```

### SentenceToken

Each tokenized sentence is returned as a `SentenceToken` object:

```typescript
interface SentenceToken {
  // The sentence text
  sentence: string;
  // Starting character position in the original text
  start: number;
  // Ending character position in the original text
  end: number;
}
```

### Setup Function

```typescript
// Download and prepare the NLTK Punkt models
await setupPunkt(): Promise<void>;
```

## How It Works

The Punkt tokenizer uses an unsupervised algorithm to build a model for abbreviation words, collocations, and words that start sentences. It uses these models to enhance the accuracy of sentence boundary detection.

This implementation:

1. Downloads the pre-trained models from NLTK
2. Converts them to a JSON format for efficient use in JavaScript/TypeScript
3. Uses these models to perform sentence tokenization

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/punkt-tokenizer-ts.git
cd punkt-tokenizer-ts

# Install dependencies
npm install

# Run the setup to download models
npm start
```

### Project Structure

- `src/punkt.ts` - Main implementation of the Punkt tokenizer
- `src/setup.ts` - Setup function to download and prepare models
- `src/downloadSources.ts` - Functions to download NLTK data
- `src/convertPunktData.ts` - Functions to convert NLTK data to JSON
- `src/languageMap.ts` - Mapping between language names and codes
- `src/tests/` - Test files

## License

ISC

## Author

Francesco Intini <francesco.intini@solomei.ai>
