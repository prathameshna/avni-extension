import { countTokens } from '../core/tokenizer.js';

const geminiAdapter = {
  name: 'Gemini',
  url: 'gemini.google.com',
  
  tokenizer: (text) => {
    // Gemini specific tokenization if any
    return countTokens(text);
  },
  
  injectUI: () => {
    // TODO: Identify Gemini DOM insertion points
    console.log('[Avni] Injecting UI into Gemini');
  },
  
  observeDOM: (callback) => {
    // TODO: Setup MutationObserver for Gemini DOM changes
    console.log('[Avni] Observing Gemini DOM');
  }
};

export default geminiAdapter;
