interface ErrorLog {
  id: string
  timestamp: string
  level: 'error' | 'warn' | 'info'
  message: string
  stack?: string
  userId?: string
  requestId?: string
  userAgent?: string
  ip?: string
  url?: string
  method?: string
  statusCode?: number
  context?: Record<string, any>
  type?: string
  duration?: number
  businessId?: string
}

class ErrorMonitor {
  private logs: ErrorLog[] = []
  private readonly maxLogs = 1000 // Keep last 1000 logs in memory

  log(level: ErrorLog['level'], message: string, context: Partial<ErrorLog> = {}) {
    const log: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    }

    this.logs.push(log)

    // Keep only the last maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output
    const prefix = `[${log.timestamp}] [${log.level.toUpperCase()}]`
    switch (level) {
      case 'error':
        console.error(prefix, message, context)
        break
      case 'warn':
        console.warn(prefix, message, context)
        break
      case 'info':
        console.info(prefix, message, context)
        break
    }

    // In production, send to external service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(log)
    }
  }

  error(message: string, error?: Error, context: Partial<ErrorLog> = {}) {
    this.log('error', message, {
      stack: error?.stack,
      ...context,
    })
  }

  warn(message: string, context: Partial<ErrorLog> = {}) {
    this.log('warn', message, context)
  }

  info(message: string, context: Partial<ErrorLog> = {}) {
    this.log('info', message, context)
  }

  // Security event logging
  securityEvent(event: string, details: Record<string, any> = {}) {
    this.warn(`Security Event: ${event}`, {
      ...details,
      type: 'security',
    })
  }

  // API request logging
  logApiRequest(request: Request, response: Response, duration: number) {
    const url = new URL(request.url)
    const method = request.method
    const statusCode = response.status
    const userAgent = request.headers.get('user-agent') || undefined
    const ip = this.getClientIP(request)

    this.info(`API Request: ${method} ${url.pathname}`, {
      method,
      url: url.pathname,
      statusCode,
      duration,
      userAgent,
      ip,
      type: 'api_request',
    })

    // Log errors
    if (statusCode >= 400) {
      this.error(`API Error: ${method} ${url.pathname}`, undefined, {
        method,
        url: url.pathname,
        statusCode,
        duration,
        userAgent,
        ip,
        type: 'api_error',
      })
    }
  }

  // Authentication events
  logAuthEvent(event: 'login' | 'logout' | 'signup' | 'failed_login', userId?: string, details: Record<string, any> = {}) {
    this.info(`Auth Event: ${event}`, {
      userId,
      ...details,
      type: 'auth',
    })
  }

  // Business events
  logBusinessEvent(event: 'create' | 'update' | 'delete', businessId: string, userId: string, details: Record<string, any> = {}) {
    this.info(`Business Event: ${event}`, {
      businessId,
      userId,
      ...details,
      type: 'business',
    })
  }

  // Get logs for debugging
  getLogs(level?: ErrorLog['level'], limit = 100): ErrorLog[] {
    let filtered = this.logs
    if (level) {
      filtered = filtered.filter(log => log.level === level)
    }
    return filtered.slice(-limit)
  }

  // Get error statistics
  getStats() {
    const now = Date.now()
    const oneHourAgo = now - (60 * 60 * 1000)
    const oneDayAgo = now - (24 * 60 * 60 * 1000)

    const recentLogs = this.logs.filter(log => new Date(log.timestamp).getTime() > oneDayAgo)
    const hourlyLogs = this.logs.filter(log => new Date(log.timestamp).getTime() > oneHourAgo)

    return {
      total: this.logs.length,
      errors: this.logs.filter(log => log.level === 'error').length,
      warnings: this.logs.filter(log => log.level === 'warn').length,
      last24h: {
        total: recentLogs.length,
        errors: recentLogs.filter(log => log.level === 'error').length,
        warnings: recentLogs.filter(log => log.level === 'warn').length,
      },
      lastHour: {
        total: hourlyLogs.length,
        errors: hourlyLogs.filter(log => log.level === 'error').length,
        warnings: hourlyLogs.filter(log => log.level === 'warn').length,
      },
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    return forwarded?.split(',')[0] || realIp || 'unknown'
  }

  private async sendToExternalService(log: ErrorLog) {
    // Send to external monitoring service (e.g., Sentry, LogRocket, etc.)
    // This is where you'd integrate with your preferred error monitoring service
    
    try {
      // Example: Send to a webhook
      if (process.env.ERROR_WEBHOOK_URL) {
        await fetch(process.env.ERROR_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log),
        })
      }
    } catch (error) {
      // Don't log errors from error logging to avoid infinite loops
      console.error('Failed to send error to external service:', error)
    }
  }
}

// Create singleton instance
const errorMonitor = new ErrorMonitor()

export default errorMonitor

// Convenience functions
export const logError = (message: string, error?: Error, context?: Partial<ErrorLog>) => 
  errorMonitor.error(message, error, context)

export const logWarning = (message: string, context?: Partial<ErrorLog>) => 
  errorMonitor.warn(message, context)

export const logInfo = (message: string, context?: Partial<ErrorLog>) => 
  errorMonitor.info(message, context)

export const logSecurityEvent = (event: string, details?: Record<string, any>) => 
  errorMonitor.securityEvent(event, details)

export const logAuthEvent = (event: 'login' | 'logout' | 'signup' | 'failed_login', userId?: string, details?: Record<string, any>) => 
  errorMonitor.logAuthEvent(event, userId, details)

export const logBusinessEvent = (event: 'create' | 'update' | 'delete', businessId: string, userId: string, details?: Record<string, any>) => 
  errorMonitor.logBusinessEvent(event, businessId, userId, details) 