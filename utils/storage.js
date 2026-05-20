/**
 * Wrapper for Chrome extension storage API
 */

export const storage = {
  /**
   * Save data to chrome.storage.local
   * @param {string} key 
   * @param {any} value 
   * @returns {Promise<void>}
   */
  set: (key, value) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Get data from chrome.storage.local
   * @param {string} key 
   * @returns {Promise<any>}
   */
  get: (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[key]);
        }
      });
    });
  },

  /**
   * Remove data from chrome.storage.local
   * @param {string} key 
   * @returns {Promise<void>}
   */
  remove: (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(key, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }
};
