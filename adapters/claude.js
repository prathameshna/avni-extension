import { countTokens } from '../core/tokenizer.js';

const claudeAdapter = {
  name: 'Claude',
  url: 'claude.ai',
  
  tokenizer: (text) => {
    // Claude specific tokenization if any
    return countTokens(text);
  },
  
  injectUI: () => {
    // TODO: Identify Claude DOM insertion points
    // Example: document.querySelector('.input-container').appendChild(...)
    console.log('[Avni] Injecting UI into Claude');
  },
  
  observeDOM: (callback) => {
    // TODO: Setup MutationObserver for Claude DOM changes
    console.log('[Avni] Observing Claude DOM');
  }
};

export default claudeAdapter;
