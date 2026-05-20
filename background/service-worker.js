/**
 * Background Service Worker for Avni Extension
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Avni] Extension installed.');
  
  // Initialize default settings in storage if needed
  chrome.storage.local.get(['clipboardHistory'], (result) => {
    if (!result.clipboardHistory) {
      chrome.storage.local.set({ clipboardHistory: [] });
    }
  });
});

// Setup message listener for communication between content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SAVE_CLIPBOARD') {
    // TODO: Handle saving to clipboard history
    console.log('[Avni Background] Saving to clipboard:', request.data);
    sendResponse({ success: true });
  }
  
  // Return true to indicate asynchronous response if needed
  return true;
});
