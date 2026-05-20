/**
 * Detects the AI platform from the given URL.
 * @param {string} url - The current page URL.
 * @returns {string|null} - The platform name identifier or null if not supported.
 */
export function detectPlatform(url) {
  if (!url) return null;
  
  if (url.includes('claude.ai')) return 'claude';
  if (url.includes('chatgpt.com')) return 'chatgpt';
  if (url.includes('gemini.google.com')) return 'gemini';
  if (url.includes('grok.com')) return 'grok';
  if (url.includes('deepseek.com')) return 'deepseek';
  if (url.includes('meta.ai')) return 'metaai';

  return null;
}
