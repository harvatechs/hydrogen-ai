
import DOMPurify from 'dompurify';
import { ValidationRule, ValidationResult, SecurityAuditEntry, SecurityAuditType } from "@/types/security";

// Enhanced security rules for input validation
const commonValidationRules: ValidationRule[] = [
  {
    pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    message: "Script tags are not allowed for security reasons"
  },
  {
    pattern: /javascript:/gi,
    message: "JavaScript protocol in URLs is not allowed"
  },
  {
    pattern: /data:/gi,
    message: "Data URIs may contain malicious content"
  },
  {
    pattern: /on\w+\s*=\s*["']?[^"']*["']?/gi,
    message: "Inline event handlers are not allowed"
  },
  {
    pattern: /<iframe\b[^>]*>/gi,
    message: "Iframe elements are not allowed"
  },
  {
    pattern: /<object\b[^>]*>/gi,
    message: "Object elements are not allowed"
  },
  {
    pattern: /<embed\b[^>]*>/gi,
    message: "Embed elements are not allowed"
  }
];

/**
 * Enhanced input validation with comprehensive security checks
 */
export function validateAndSanitizeInput(
  input: string,
  additionalRules: ValidationRule[] = []
): ValidationResult {
  // Skip validation for empty inputs
  if (!input || input.trim() === '') {
    return { isValid: true, sanitizedInput: '' };
  }

  // Check input length to prevent DoS attacks
  if (input.length > 10000) {
    logSecurityAudit('input-validation', `Input too long: ${input.length} characters`, 'high');
    return {
      isValid: false,
      message: 'Input is too long'
    };
  }

  // Combine rules
  const allRules = [...commonValidationRules, ...additionalRules];

  // Check against validation rules
  for (const rule of allRules) {
    if (rule.pattern.test(input)) {
      logSecurityAudit('input-validation', `Blocked input matching pattern: ${rule.pattern}`, 'medium');
      return {
        isValid: false,
        message: rule.message
      };
    }
  }

  // Advanced XSS protection
  const xssPatterns = [
    /(\b)(on\S+)(\s*)=|javascript:|(<\s*)(\/*)script/gi,
    /vbscript:|data:text\/html|data:application\/javascript/gi,
    /expression\s*\(|@import|\.cookie|document\.|window\.|eval\(/gi
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      logSecurityAudit('input-validation', 'XSS attempt detected', 'high');
      return {
        isValid: false,
        message: 'Potentially malicious content detected'
      };
    }
  }

  // SQL injection patterns
  const sqlPatterns = [
    /(union\s+select|select\s+\*|insert\s+into|delete\s+from|drop\s+table)/gi,
    /(exec\s*\(|exec\s+|execute\s*\()/gi,
    /(\'\s*(or|and)\s*\'|\"s*(or|and)\s*\")/gi
  ];

  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) {
      logSecurityAudit('input-validation', 'SQL injection attempt detected', 'high');
      return {
        isValid: false,
        message: 'Invalid characters detected'
      };
    }
  }

  // If passed all rules, sanitize the input
  const sanitizedInput = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
  
  return {
    isValid: true,
    sanitizedInput
  };
}

/**
 * Securely store sensitive data in memory with encryption-like obfuscation
 */
export function createSecureStorage() {
  const secureData = new Map<string, string>();

  // Simple obfuscation for memory storage
  const obfuscate = (value: string): string => {
    return btoa(value).split('').reverse().join('');
  };

  const deobfuscate = (value: string): string => {
    return atob(value.split('').reverse().join(''));
  };

  return {
    set: (key: string, value: any): void => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      secureData.set(key, obfuscate(stringValue));
    },
    get: (key: string): any => {
      const obfuscatedValue = secureData.get(key);
      if (!obfuscatedValue) return undefined;
      
      try {
        const deobfuscatedValue = deobfuscate(obfuscatedValue);
        try {
          return JSON.parse(deobfuscatedValue);
        } catch {
          return deobfuscatedValue;
        }
      } catch {
        return undefined;
      }
    },
    remove: (key: string): boolean => {
      return secureData.delete(key);
    },
    clear: (): void => {
      secureData.clear();
    },
    keys: (): string[] => {
      return Array.from(secureData.keys());
    }
  };
}

/**
 * Enhanced security audit logging with threat detection
 */
const securityAuditLog: SecurityAuditEntry[] = [];
const MAX_LOG_ENTRIES = 1000;

export function logSecurityAudit(
  type: SecurityAuditType,
  details: string,
  severity: 'low' | 'medium' | 'high' = 'low'
): void {
  const entry: SecurityAuditEntry = {
    type,
    timestamp: new Date(),
    details,
    severity
  };
  
  securityAuditLog.unshift(entry);
  
  // Maintain log size
  if (securityAuditLog.length > MAX_LOG_ENTRIES) {
    securityAuditLog.splice(MAX_LOG_ENTRIES);
  }
  
  // Enhanced logging for different severity levels
  if (severity === 'high') {
    console.error(`🚨 SECURITY ALERT [${type}]: ${details}`);
  } else if (severity === 'medium') {
    console.warn(`⚠️ Security Warning [${type}]: ${details}`);
  } else {
    console.log(`ℹ️ Security Info [${type}]: ${details}`);
  }
}

export function getSecurityAuditLog(): SecurityAuditEntry[] {
  return [...securityAuditLog];
}

/**
 * Enhanced rate limiting with IP tracking simulation
 */
const requestCounts = new Map<string, { count: number, resetTime: number, violations: number }>();
const RATE_LIMIT_VIOLATIONS_THRESHOLD = 3;

export function checkRateLimit(
  identifier: string, 
  maxRequests: number, 
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(identifier);
  
  // If no previous requests or window expired, reset counter
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
      violations: userRequests?.violations || 0
    });
    return true;
  }
  
  // Check if under rate limit
  if (userRequests.count < maxRequests) {
    userRequests.count++;
    return true;
  }
  
  // Rate limit exceeded
  userRequests.violations++;
  
  if (userRequests.violations >= RATE_LIMIT_VIOLATIONS_THRESHOLD) {
    logSecurityAudit('rate-limit', `Repeated rate limit violations for ${identifier}`, 'high');
  } else {
    logSecurityAudit('rate-limit', `Rate limit exceeded for ${identifier}`, 'medium');
  }
  
  return false;
}

/**
 * Content Security Policy header generator
 */
export function generateCSPHeader(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.gemini.com https://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
}

/**
 * Password strength validation
 */
export function validatePasswordStrength(password: string): {
  isStrong: boolean;
  score: number;
  suggestions: string[];
} {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length < 8) {
    suggestions.push('Use at least 8 characters');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    suggestions.push('Include lowercase letters');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    suggestions.push('Include uppercase letters');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    suggestions.push('Include numbers');
  } else {
    score += 1;
  }

  if (!/[@$!%*?&]/.test(password)) {
    suggestions.push('Include special characters (@$!%*?&)');
  } else {
    score += 1;
  }

  // Check for common patterns
  const commonPatterns = [
    /123456|password|qwerty|abc123/i,
    /(.)\1{2,}/,  // Repeated characters
    /(012|123|234|345|456|567|678|789|890)/,  // Sequential numbers
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      suggestions.push('Avoid common patterns and repeated characters');
      score -= 1;
      break;
    }
  }

  return {
    isStrong: score >= 4 && password.length >= 8,
    score: Math.max(0, Math.min(5, score)),
    suggestions
  };
}

/**
 * Secure session management
 */
export function createSecureSessionManager() {
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  let sessionTimer: NodeJS.Timeout | null = null;

  return {
    startSession: (onTimeout: () => void) => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
      
      sessionTimer = setTimeout(() => {
        logSecurityAudit('session', 'Session timeout', 'low');
        onTimeout();
      }, SESSION_TIMEOUT);
    },

    refreshSession: (onTimeout: () => void) => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
      
      sessionTimer = setTimeout(() => {
        logSecurityAudit('session', 'Session timeout', 'low');
        onTimeout();
      }, SESSION_TIMEOUT);
    },

    endSession: () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
        sessionTimer = null;
      }
    }
  };
}
