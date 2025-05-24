
/**
 * Enhanced security monitoring service with advanced threat detection
 */

type SecurityEvent = 'failed-auth' | 'api-rate-limit' | 'invalid-input' | 'suspicious-activity' | 'session-anomaly' | 'data-breach-attempt';

interface SecurityLog {
  event: SecurityEvent;
  details: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ipAddress?: string;
  userAgent?: string;
  fingerprint?: string;
}

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  highEvents: number;
  blockedRequests: number;
  uniqueThreats: number;
}

class SecurityMonitor {
  private logs: SecurityLog[] = [];
  private failedAuthAttempts: {[key: string]: { count: number; timestamps: Date[] }} = {};
  private suspiciousIps: Set<string> = new Set();
  private blockedIps: Set<string> = new Set();
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly MAX_FAILED_ATTEMPTS_WINDOW = 15 * 60 * 1000; // 15 minutes
  private readonly MAX_LOG_ENTRIES = 5000;
  
  constructor() {
    this.initializeSecurityMonitoring();
  }

  private initializeSecurityMonitoring(): void {
    // Reset counters every hour
    setInterval(() => {
      this.cleanupOldAttempts();
    }, 60 * 60 * 1000);
    
    // Clear old logs after 7 days
    setInterval(() => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      this.logs = this.logs.filter(log => log.timestamp >= sevenDaysAgo);
    }, 24 * 60 * 60 * 1000);
    
    // Monitor for patterns every 5 minutes
    setInterval(() => {
      this.detectSuspiciousPatterns();
    }, 5 * 60 * 1000);
  }

  private cleanupOldAttempts(): void {
    const cutoffTime = new Date(Date.now() - this.MAX_FAILED_ATTEMPTS_WINDOW);
    
    for (const [ip, attempts] of Object.entries(this.failedAuthAttempts)) {
      attempts.timestamps = attempts.timestamps.filter(timestamp => timestamp >= cutoffTime);
      attempts.count = attempts.timestamps.length;
      
      if (attempts.count === 0) {
        delete this.failedAuthAttempts[ip];
      }
    }
  }

  private detectSuspiciousPatterns(): void {
    const recentLogs = this.getRecentLogs(100);
    
    // Detect rapid-fire requests
    const rapidRequests = recentLogs.filter(log => 
      log.timestamp > new Date(Date.now() - 60000) // Last minute
    );
    
    if (rapidRequests.length > 50) {
      this.logEvent('suspicious-activity', 'Rapid request pattern detected', 'high');
    }
    
    // Detect unusual authentication patterns
    const authFailures = recentLogs.filter(log => log.event === 'failed-auth');
    const uniqueIps = new Set(authFailures.map(log => log.ipAddress));
    
    if (uniqueIps.size > 10 && authFailures.length > 20) {
      this.logEvent('suspicious-activity', 'Distributed authentication attack detected', 'critical');
    }
  }
  
  logEvent(
    event: SecurityEvent, 
    details: string, 
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low',
    metadata?: { ipAddress?: string; userAgent?: string; fingerprint?: string }
  ): void {
    const log: SecurityLog = {
      event,
      details,
      timestamp: new Date(),
      severity,
      ...metadata
    };
    
    this.logs.unshift(log);
    
    // Maintain log size
    if (this.logs.length > this.MAX_LOG_ENTRIES) {
      this.logs.splice(this.MAX_LOG_ENTRIES);
    }
    
    // Enhanced logging with color coding
    const logMessage = `[${log.timestamp.toISOString()}] ${event.toUpperCase()}: ${details}`;
    
    switch (severity) {
      case 'critical':
        console.error(`🚨 CRITICAL SECURITY ALERT: ${logMessage}`);
        this.handleCriticalThreat(log);
        break;
      case 'high':
        console.error(`⚠️ HIGH SECURITY ALERT: ${logMessage}`);
        this.handleHighThreat(log);
        break;
      case 'medium':
        console.warn(`⚠️ Security Warning: ${logMessage}`);
        break;
      default:
        console.log(`ℹ️ Security Info: ${logMessage}`);
    }
    
    // Track failed auth attempts with enhanced logic
    if (event === 'failed-auth' && metadata?.ipAddress) {
      this.trackFailedAuth(metadata.ipAddress);
    }
  }

  private handleCriticalThreat(log: SecurityLog): void {
    // Implement immediate response to critical threats
    if (log.ipAddress) {
      this.blockedIps.add(log.ipAddress);
    }
    
    // Could trigger notifications, API calls, etc.
    console.error('IMPLEMENTING EMERGENCY SECURITY PROTOCOLS');
  }

  private handleHighThreat(log: SecurityLog): void {
    // Implement response to high severity threats
    if (log.ipAddress) {
      this.suspiciousIps.add(log.ipAddress);
    }
  }

  private trackFailedAuth(ipAddress: string): void {
    if (!this.failedAuthAttempts[ipAddress]) {
      this.failedAuthAttempts[ipAddress] = { count: 0, timestamps: [] };
    }
    
    const now = new Date();
    this.failedAuthAttempts[ipAddress].timestamps.push(now);
    this.failedAuthAttempts[ipAddress].count++;
    
    // Clean old timestamps
    const cutoffTime = new Date(now.getTime() - this.MAX_FAILED_ATTEMPTS_WINDOW);
    this.failedAuthAttempts[ipAddress].timestamps = 
      this.failedAuthAttempts[ipAddress].timestamps.filter(timestamp => timestamp >= cutoffTime);
    this.failedAuthAttempts[ipAddress].count = this.failedAuthAttempts[ipAddress].timestamps.length;
    
    // Check for blocking threshold
    if (this.failedAuthAttempts[ipAddress].count >= this.MAX_FAILED_ATTEMPTS) {
      this.suspiciousIps.add(ipAddress);
      this.logEvent('suspicious-activity', `IP ${ipAddress} exceeded failed auth threshold`, 'high', { ipAddress });
    }
  }
  
  isIpBlocked(ipAddress: string): boolean {
    return this.blockedIps.has(ipAddress) || this.suspiciousIps.has(ipAddress);
  }

  isSuspicious(ipAddress: string): boolean {
    return this.suspiciousIps.has(ipAddress);
  }
  
  getRecentLogs(count: number = 10): SecurityLog[] {
    return this.logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, count);
  }

  getLogsByEvent(event: SecurityEvent, limit: number = 50): SecurityLog[] {
    return this.logs
      .filter(log => log.event === event)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getLogsBySeverity(severity: SecurityLog['severity'], limit: number = 50): SecurityLog[] {
    return this.logs
      .filter(log => log.severity === severity)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getSecurityMetrics(): SecurityMetrics {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentLogs = this.logs.filter(log => log.timestamp >= last24Hours);
    
    return {
      totalEvents: recentLogs.length,
      criticalEvents: recentLogs.filter(log => log.severity === 'critical').length,
      highEvents: recentLogs.filter(log => log.severity === 'high').length,
      blockedRequests: recentLogs.filter(log => log.event === 'api-rate-limit').length,
      uniqueThreats: new Set(recentLogs.map(log => log.ipAddress)).size
    };
  }
  
  clearLogs(): void {
    this.logs = [];
    console.log('Security logs cleared');
  }

  clearBlocked(): void {
    this.blockedIps.clear();
    this.suspiciousIps.clear();
    console.log('Blocked IPs cleared');
  }
  
  getFailedAuthAttempts(ipAddress: string): number {
    return this.failedAuthAttempts[ipAddress]?.count || 0;
  }

  exportSecurityReport(): string {
    const metrics = this.getSecurityMetrics();
    const recentCriticalLogs = this.getLogsBySeverity('critical', 10);
    const recentHighLogs = this.getLogsBySeverity('high', 20);
    
    const report = {
      timestamp: new Date().toISOString(),
      metrics,
      criticalEvents: recentCriticalLogs,
      highPriorityEvents: recentHighLogs,
      blockedIPs: Array.from(this.blockedIps),
      suspiciousIPs: Array.from(this.suspiciousIps)
    };
    
    return JSON.stringify(report, null, 2);
  }
}

// Singleton instance
export const securityMonitor = new SecurityMonitor();

// Export enhanced security utilities
export { SecurityLog, SecurityEvent, SecurityMetrics };
