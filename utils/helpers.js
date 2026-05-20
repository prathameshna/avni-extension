/**
 * General helper functions for the Avni extension
 */

/**
 * Generate a unique ID
 * @returns {string}
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format timestamp to a relative time string (e.g., "2m ago")
 * @param {number} timestamp 
 * @returns {string}
 */
export function formatRelativeTime(timestamp) {
  const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}
