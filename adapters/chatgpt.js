import { countTokens } from '../core/tokenizer.js';

const chatgptAdapter = {
  name: 'ChatGPT',
  url: 'chatgpt.com',
  
  tokenizer: (text) => {
    // ChatGPT specific tokenization if any
    return countTokens(text);
  },
  
  injectUI: () => {
    // TODO: Identify ChatGPT DOM insertion points
    console.log('[Avni] Injecting UI into ChatGPT');
  },
  
  observeDOM: (callback) => {
    // TODO: Setup MutationObserver for ChatGPT DOM changes
    console.log('[Avni] Observing ChatGPT DOM');
  }
};

export default chatgptAdapter;
