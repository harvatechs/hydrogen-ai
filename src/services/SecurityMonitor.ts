
/**
 * Security monitoring service to track and prevent potential attacks
 */

type SecurityEvent = 'failed-auth' | 'api-rate-limit' | 'invalid-input' | 'suspicious-activity';

interface SecurityLog {
  event: SecurityEvent;
  details: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  ipAddress?: string;
}

class SecurityMonitor {
  private logs: SecurityLog[] = [];
  private failedAuthAttempts: {[key: string]: number} = {};
  private suspiciousIps: Set<string> = new Set();
  private readonly MAX_FAILED_ATTEMPTS = 5;
  
  constructor() {
    // Reset counters every hour
    setInterval(() => {
      this.failedAuthAttempts = {};
    }, 60 * 60 * 1000);
    
    // Clear old logs after 24 hours
    setInterval(() => {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      this.logs = this.logs.filter(log => log.timestamp >= twentyFourHoursAgo);
    }, 60 * 60 * 1000);
  }
  
  logEvent(event: SecurityEvent, details: string, severity: 'low' | 'medium' | 'high' = 'low'): void {
    const log: SecurityLog = {
      event,
      details,
      timestamp: new Date(),
      severity
    };
    
    this.logs.push(log);
    
    // Log high severity events to console
    if (severity === 'high') {
      console.warn(`Security event: ${event} - ${details}`);
    }
    
    // Track failed auth attempts
    if (event === 'failed-auth') {
      const ipAddress = 'unknown'; // In a real app, you'd get the IP
      
      if (!this.failedAuthAttempts[ipAddress]) {
        this.failedAuthAttempts[ipAddress] = 0;
      }
      
      this.failedAuthAttempts[ipAddress]++;
      
      // Block after too many failures
      if (this.failedAuthAttempts[ipAddress] >= this.MAX_FAILED_ATTEMPTS) {
        this.suspiciousIps.add(ipAddress);
      }
    }
  }
  
  isIpBlocked(ipAddress: string): boolean {
    return this.suspiciousIps.has(ipAddress);
  }
  
  getRecentLogs(count: number = 10): SecurityLog[] {
    return [...this.logs]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, count);
  }
  
  clearLogs(): void {
    this.logs = [];
  }
  
  getFailedAuthAttempts(ipAddress: string): number {
    return this.failedAuthAttempts[ipAddress] || 0;
  }
}

export const securityMonitor = new SecurityMonitor();
export type { SecurityEvent, SecurityLog };
