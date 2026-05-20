import { detectPlatform } from '../utils/urlDetector.js';

// Adapters
import claudeAdapter from '../adapters/claude.js';
import chatgptAdapter from '../adapters/chatgpt.js';
import geminiAdapter from '../adapters/gemini.js';
import grokAdapter from '../adapters/grok.js';
import deepseekAdapter from '../adapters/deepseek.js';
import metaaiAdapter from '../adapters/metaai.js';

const adapters = {
  claude: claudeAdapter,
  chatgpt: chatgptAdapter,
  gemini: geminiAdapter,
  grok: grokAdapter,
  deepseek: deepseekAdapter,
  metaai: metaaiAdapter
};

class AvniEngine {
  constructor() {
    this.currentAdapter = null;
    this.platform = null;
  }

  /**
   * Initialize the engine by detecting platform and loading adapter
   */
  init() {
    this.platform = detectPlatform(window.location.href);
    
    if (this.platform && adapters[this.platform]) {
      this.currentAdapter = adapters[this.platform];
      console.log(`[Avni Engine] Initialized for platform: ${this.platform}`);
      this.setupObserver();
    } else {
      console.log(`[Avni Engine] Platform not supported or detected: ${window.location.href}`);
    }
  }

  /**
   * Setup DOM observation using the active adapter
   */
  setupObserver() {
    if (this.currentAdapter && this.currentAdapter.observeDOM) {
      this.currentAdapter.observeDOM(() => {
        // Callback when DOM changes (e.g., to inject UI)
        this.injectUI();
      });
    }
  }

  /**
   * Inject UI elements into the platform
   */
  injectUI() {
    if (this.currentAdapter && this.currentAdapter.injectUI) {
      this.currentAdapter.injectUI();
    }
  }

  /**
   * Tokenize text using the active adapter
   * @param {string} text 
   * @returns {number} count of tokens
   */
  countTokens(text) {
    if (this.currentAdapter && this.currentAdapter.tokenizer) {
      return this.currentAdapter.tokenizer(text);
    }
    return 0; // Fallback or throw error
  }
}

export default new AvniEngine();
