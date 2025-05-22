
/**
 * Security-related types for the application
 */

export type TokenStatus = 'valid' | 'expired' | 'invalid' | 'missing';

export interface SecuritySettings {
  apiKeyRequired: boolean;
  apiRateLimiting: boolean;
  maxRequestsPerMinute: number;
  contentFiltering: boolean;
  sanitizeUserInput: boolean;
  enableInputValidation: boolean;
  enableXSSProtection: boolean;
  blockedPatterns: string[];
}

export interface ApiKeyValidationResult {
  isValid: boolean;
  message: string;
  validUntil?: Date;
}

export type PermissionLevel = 'read' | 'write' | 'admin';

export interface UserAccess {
  canViewHistory: boolean;
  canEditSettings: boolean;
  canClearConversations: boolean;
  canChangeModel: boolean;
  isApiKeyAdmin: boolean;
  permissionLevel: PermissionLevel;
}

/**
 * Input validation utility types
 */
export interface ValidationRule {
  pattern: RegExp;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  sanitizedInput?: string;
  message?: string;
}

export type SecurityAuditType = 'key-usage' | 'input-validation' | 'rate-limit' | 'suspicious-activity';

export interface SecurityAuditEntry {
  type: SecurityAuditType;
  timestamp: Date;
  details: string;
  severity: 'low' | 'medium' | 'high';
}
