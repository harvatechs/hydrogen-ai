
/**
 * Security utility functions for HydroGen AI
 */

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Replace potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#x60;');
};

/**
 * Validates API keys to ensure they match expected formats
 */
export const validateApiKey = (key: string): boolean => {
  if (!key) return false;
  
  // Check for minimum length
  if (key.length < 20) return false;
  
  // For Google Gemini keys specifically
  if (key.startsWith('AIza')) {
    // Simple validation for Google API key format
    return /^AIza[A-Za-z0-9_-]{35}$/.test(key);
  }
  
  // General validation for other API keys
  return /^[A-Za-z0-9_-]{20,}$/.test(key);
};

/**
 * Validates API URLs to ensure they are from trusted domains
 */
export const validateApiUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    
    // List of allowed API domains
    const allowedDomains = [
      'generativelanguage.googleapis.com',
      'api.openai.com',
      'api.anthropic.com'
    ];
    
    return allowedDomains.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain));
  } catch (e) {
    return false;
  }
};

/**
 * Safely stores sensitive data in localStorage with expiration
 */
export const secureStore = {
  set: (key: string, value: string, expirationInHours = 24): void => {
    const item = {
      value,
      expiry: new Date().getTime() + expirationInHours * 60 * 60 * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  get: (key: string): string | null => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    try {
      const item = JSON.parse(itemStr);
      const now = new Date().getTime();
      
      // Check if the item has expired
      if (now > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (e) {
      // If there's an error parsing, return the raw value
      // This handles backward compatibility
      return itemStr;
    }
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(key);
  }
};

/**
 * Rate limiting utility to prevent API abuse
 */
export class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private timeWindow: number; // in milliseconds
  
  constructor(maxRequests = 5, timeWindowInSeconds = 60) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowInSeconds * 1000;
  }
  
  canMakeRequest(): boolean {
    const now = Date.now();
    
    // Remove timestamps outside the window
    this.requests = this.requests.filter(timestamp => 
      now - timestamp < this.timeWindow
    );
    
    // Check if we've reached the limit
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current timestamp
    this.requests.push(now);
    return true;
  }
  
  getTimeUntilNextAllowed(): number {
    if (this.requests.length === 0) return 0;
    
    const now = Date.now();
    const oldestTimestamp = this.requests[0];
    const timeUntilExpiry = this.timeWindow - (now - oldestTimestamp);
    
    return Math.max(0, timeUntilExpiry);
  }
}
