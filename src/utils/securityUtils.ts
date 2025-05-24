
import DOMPurify from 'dompurify';
import { ValidationRule, ValidationResult, SecurityAuditEntry, SecurityAuditType } from "@/types/security";

// Common security rules for input validation
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
  }
];

/**
 * Validates input against security rules and sanitizes it
 * @param input The user input to validate
 * @param additionalRules Optional additional validation rules
 * @returns Validation result with sanitized input if valid
 */
export function validateAndSanitizeInput(
  input: string,
  additionalRules: ValidationRule[] = []
): ValidationResult {
  // Skip validation for empty inputs
  if (!input || input.trim() === '') {
    return { isValid: true, sanitizedInput: '' };
  }

  // Combine rules
  const allRules = [...commonValidationRules, ...additionalRules];

  // Check against validation rules
  for (const rule of allRules) {
    if (rule.pattern.test(input)) {
      // Log security audit event
      logSecurityAudit('input-validation', `Blocked input matching pattern: ${rule.pattern}`, 'medium');
      
      return {
        isValid: false,
        message: rule.message
      };
    }
  }

  // If passed all rules, sanitize the input
  const sanitizedInput = DOMPurify.sanitize(input);
  
  return {
    isValid: true,
    sanitizedInput
  };
}

/**
 * Securely store sensitive data in memory
 * Uses a closure to prevent direct access to the data
 */
export function createSecureStorage() {
  const secureData = new Map<string, any>();

  return {
    set: (key: string, value: any): void => {
      secureData.set(key, value);
    },
    get: (key: string): any => {
      return secureData.get(key);
    },
    remove: (key: string): boolean => {
      return secureData.delete(key);
    },
    clear: (): void => {
      secureData.clear();
    }
  };
}

/**
 * Security audit logging
 */
const securityAuditLog: SecurityAuditEntry[] = [];

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
  
  securityAuditLog.push(entry);
  
  // For high severity issues, also log to console
  if (severity === 'high') {
    console.warn(`Security audit [${type}]: ${details}`);
  }
}

export function getSecurityAuditLog(): SecurityAuditEntry[] {
  return [...securityAuditLog];
}

/**
 * Rate limiting utility
 */
const requestCounts = new Map<string, { count: number, resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests: number, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(identifier);
  
  // If no previous requests or window expired, reset counter
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }
  
  // Check if under rate limit
  if (userRequests.count < maxRequests) {
    userRequests.count++;
    return true;
  }
  
  // Rate limit exceeded
  logSecurityAudit('rate-limit', `Rate limit exceeded for ${identifier}`, 'medium');
  return false;
}
