import engine from '../core/engine.js';

/**
 * Main Content Script for Avni Extension
 */
console.log('[Avni] Content script loaded.');

// Initialize the core engine which detects platform and sets up observers
engine.init();

// Example message passing setup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'PING') {
    sendResponse({ status: 'active', platform: engine.platform });
  }
});
