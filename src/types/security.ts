
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
