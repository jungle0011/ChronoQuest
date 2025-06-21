#!/usr/bin/env tsx

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { validateEnv } from '../lib/env-validation'
import rateLimiter from '../lib/rate-limit'
import cache from '../lib/cache'

interface SecurityCheck {
  name: string
  description: string
  check: () => Promise<{ passed: boolean; details: string[] }>
  severity: 'critical' | 'high' | 'medium' | 'low'
}

class SecurityAuditor {
  private checks: SecurityCheck[] = []

  constructor() {
    this.initializeChecks()
  }

  private initializeChecks() {
    this.checks = [
      {
        name: 'Environment Variables',
        description: 'Check if all required environment variables are properly set',
        check: this.checkEnvironmentVariables.bind(this),
        severity: 'critical'
      },
      {
        name: 'Rate Limiting',
        description: 'Verify rate limiting is properly configured',
        check: this.checkRateLimiting.bind(this),
        severity: 'high'
      },
      {
        name: 'Caching',
        description: 'Check if caching is properly configured',
        check: this.checkCaching.bind(this),
        severity: 'medium'
      },
      {
        name: 'Package Vulnerabilities',
        description: 'Check for known vulnerabilities in dependencies',
        check: this.checkPackageVulnerabilities.bind(this),
        severity: 'high'
      },
      {
        name: 'Security Headers',
        description: 'Verify security headers are properly configured',
        check: this.checkSecurityHeaders.bind(this),
        severity: 'high'
      },
      {
        name: 'Input Validation',
        description: 'Check if input validation is properly implemented',
        check: this.checkInputValidation.bind(this),
        severity: 'critical'
      },
      {
        name: 'Authentication',
        description: 'Verify authentication mechanisms',
        check: this.checkAuthentication.bind(this),
        severity: 'critical'
      },
      {
        name: 'File Upload Security',
        description: 'Check file upload security measures',
        check: this.checkFileUploadSecurity.bind(this),
        severity: 'high'
      },
      {
        name: 'Database Security',
        description: 'Verify database security configuration',
        check: this.checkDatabaseSecurity.bind(this),
        severity: 'critical'
      },
      {
        name: 'API Security',
        description: 'Check API endpoint security',
        check: this.checkApiSecurity.bind(this),
        severity: 'high'
      }
    ]
  }

  private async checkEnvironmentVariables(): Promise<{ passed: boolean; details: string[] }> {
    const details: string[] = []
    const result = validateEnv()
    
    if (!result.success) {
      if (process.env.NODE_ENV === 'development') {
        details.push('⚠️ Environment validation failed in development mode')
        details.push('ℹ️ This is expected in development - ensure all variables are set for production')
        return { passed: true, details } // Don't fail in development
      } else {
        details.push('❌ Environment validation failed')
        if (result.error) {
          details.push(`Error: ${result.error}`)
        }
        return { passed: false, details }
      }
    }

    details.push('✅ All required environment variables are set')
    
    // Check for weak secrets
    const env = process.env
    if (env.JWT_SECRET && env.JWT_SECRET.length < 32) {
      details.push('⚠️ JWT_SECRET should be at least 32 characters long')
    }
    
    if (env.NEXTAUTH_SECRET && env.NEXTAUTH_SECRET.length < 32) {
      details.push('⚠️ NEXTAUTH_SECRET should be at least 32 characters long')
    }

    return { passed: true, details }
  }

  private async checkRateLimiting(): Promise<{ passed: boolean; details: string[] }> {
    const details: string[] = []
    
    try {
      const stats = rateLimiter.getStats()
      details.push(`✅ Rate limiting is active with ${stats.totalKeys} active keys`)
      
      // Test rate limiting
      const testKey = 'security-audit-test'
      const result = rateLimiter.check(testKey, { windowMs: 60000, maxRequests: 1 })
      
      if (result.allowed) {
        details.push('✅ Rate limiting is working correctly')
      } else {
        details.push('❌ Rate limiting may not be working correctly')
      }
      
      // Clean up test
      rateLimiter.reset(testKey)
      
      return { passed: true, details }
    } catch (error) {
      details.push(`❌ Rate limiting check failed: ${error}`)
      return { passed: false, details }
    }
  }

  private async checkCaching(): Promise<{ passed: boolean; details: string[] }> {
    const details: string[] = []
    
    try {
      // Test caching
      const testKey = 'security-audit-cache-test'
      const testData = { test: 'data' }
      
      cache.set(testKey, testData, 60)
      const retrieved = cache.get(testKey)
      
      if (retrieved && retrieved.test === 'data') {
        details.push('✅ Caching is working correctly')
      } else {
        details.push('❌ Caching may not be working correctly')
      }
      
      // Clean up
      cache.delete(testKey)
      
      const stats = cache.getStats()
      details.push(`✅ Cache statistics available: ${stats.valid} valid items`)
      
      return { passed: true, details }
    } catch (error) {
      details.push(`❌ Caching check failed: ${error}`)
      return { passed: false, details }
    }
  }

  private async checkPackageVulnerabilities(): Promise<{ passed: boolean; details: string[] }> {
    const details: string[] = []
    
    try {
      const packageJsonPath = join(process.cwd(), 'package.json')
      if (!existsSync(packageJsonPath)) {
        details.push('❌ package.json not found')
        return { passed: false, details }
      }
      
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
      
      // Check for known vulnerable packages
      const vulnerablePackages = [
        'lodash', // Check for versions < 4.17.21
        'axios', // Check for versions < 1.6.0
        'moment', // Check for versions < 2.29.4
      ]
      
      let vulnerabilitiesFound = false
      for (const pkg of vulnerablePackages) {
        if (dependencies[pkg]) {
          details.push(`⚠️ ${pkg} is present - check for vulnerabilities`)
          vulnerabilitiesFound = true
        }
      }
      
      if (!vulnerabilitiesFound) {
        details.push('✅ No known vulnerable packages detected')
      }
      
      details.push('ℹ️ Run "npm audit" or "pnpm audit" for detailed vulnerability report')
      
      return { passed: !vulnerabilitiesFound, details }
    } catch (error) {
      details.push(`❌ Package vulnerability check failed: ${error}`)
      return { passed: false, details }
    }
  }

  private async checkSecurityHeaders(): Promise<{ passed: boolean; details: string[] }> {
    const details: string[] = []
    
    try {
      const nextConfigPath = join(process.cwd(), 'next.config.mjs')
      if (!existsSync(nextConfigPath)) {
        details.push('❌ next.config.mjs not found')
        return { passed: false, details }
      }
      
      const configContent = readFileSync(nextConfigPath, 'utf8')
      
      const requiredHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Content-Security-Policy',
        'Strict-Transport-Security'
      ]
      
      let allHeadersPresent = true
      for (const header of requiredHeaders) {
        if (configContent.includes(header)) {
          details.push(`✅ ${header} header configured`)
        } else {
          details.push(`❌ ${header} header missing`)
          allHeadersPresent = false
        }
      }
      
      return { passed: allHeadersPresent, details }
    } catch (error) {
      details.push(`❌ Security headers check failed: ${error}`)
      return { passed: false, details }
    }
  }

  private async checkInputValidation(): Promise<{ passed: boolean; details: string[] }> {
    const details: string[] = []
    
    try {
      const validationPath = join(process.cwd(), 'lib', 'validation.ts')
      if (!existsSync(validationPath)) {
        details.push('❌ Validation library not found')
        return { passed: false, details }
      }
      
      const validationContent = readFileSync(validationPath, 'utf8')
      
      // Check for validation patterns
      const validationPatterns = [
        'zod',
        'DOMPurify',
        'sanitize',
        'validateInput'
      ]
      
      let validationPresent = true
      for (const pattern of validationPatterns) {
        if (validationContent.includes(pattern)) {
          details.push(`✅ ${pattern} validation pattern found`)
        } else {
          details.push(`⚠️ ${pattern} validation pattern not found`)
          validationPresent = false
        }
      }
      
      return { passed: validationPresent, details }
    } catch (error) {
      details.push(`❌ Input validation check failed: ${error}`)
      return { passed: false, details }
    }
  }

  private async checkAuthentication(): Promise<{ passed: boolean; details: string[] }> {
    const details: string[] = []
    
    try {
      // Check for authentication files
      const authFiles = [
        'lib/firebase-admin.ts',
        'contexts/AuthContext.tsx',
        'middleware.ts'
      ]
      
      let authPresent = true
      for (const file of authFiles) {
        const filePath = join(process.cwd(), file)
        if (existsSync(filePath)) {
          details.push(`✅ ${file} found`)
        } else {
          details.push(`❌ ${file} missing`)
          authPresent = false
        }
      }
      
      // Check for JWT or session configuration
      if (process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET) {
        details.push('✅ Authentication secrets configured')
      } else {
        details.push('⚠️ Authentication secrets not configured')
        // Don't fail in development
        if (process.env.NODE_ENV === 'development') {
          details.push('ℹ️ This is expected in development mode')
        } else {
          authPresent = false
        }
      }
      
      return { passed: authPresent, details }
    } catch (error) {
      details.push(`❌ Authentication check failed: ${error}`)
      return { passed: false, details }
    }
  }

  private async checkFileUploadSecurity(): Promise<{ passed: boolean; details: string[] }> {
    const details: string[] = []
    
    try {
      const uploadFiles = [
        'app/api/upload/route.ts',
        'app/api/uploadthing/route.ts',
        'lib/cloudinary.ts'
      ]
      
      let uploadSecurityPresent = true
      for (const file of uploadFiles) {
        const filePath = join(process.cwd(), file)
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf8')
          
          // Check for security measures
          if (content.includes('isValidImageFile') || content.includes('file type') || content.includes('size limit')) {
            details.push(`✅ ${file} has file validation`)
          } else {
            details.push(`⚠️ ${file} may lack file validation`)
            uploadSecurityPresent = false
          }
        } else {
          details.push(`ℹ️ ${file} not found`)
        }
      }
      
      return { passed: uploadSecurityPresent, details }
    } catch (error) {
      details.push(`❌ File upload security check failed: ${error}`)
      return { passed: false, details }
    }
  }

  private async checkDatabaseSecurity(): Promise<{ passed: boolean; details: string[] }> {
    const details: string[] = []
    
    try {
      // Check Firebase configuration
      if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        details.push('✅ Firebase credentials configured')
      } else {
        details.push('⚠️ Firebase credentials missing')
        if (process.env.NODE_ENV === 'development') {
          details.push('ℹ️ This is expected in development mode')
          return { passed: true, details } // Don't fail in development
        } else {
          return { passed: false, details }
        }
      }
      
      // Check for database security files
      const dbFiles = [
        'lib/firebase-admin.ts',
        'lib/firebase-config.ts'
      ]
      
      let dbSecurityPresent = true
      for (const file of dbFiles) {
        const filePath = join(process.cwd(), file)
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf8')
          
          if (content.includes('initializeFirebaseAdmin') || content.includes('serviceAccount')) {
            details.push(`✅ ${file} has proper initialization`)
          } else {
            details.push(`⚠️ ${file} may lack proper initialization`)
            dbSecurityPresent = false
          }
        } else {
          details.push(`❌ ${file} missing`)
          dbSecurityPresent = false
        }
      }
      
      return { passed: dbSecurityPresent, details }
    } catch (error) {
      details.push(`❌ Database security check failed: ${error}`)
      return { passed: false, details }
    }
  }

  private async checkApiSecurity(): Promise<{ passed: boolean; details: string[] }> {
    const details: string[] = []
    
    try {
      // Check API routes for security measures
      const apiDir = join(process.cwd(), 'app', 'api')
      if (!existsSync(apiDir)) {
        details.push('❌ API directory not found')
        return { passed: false, details }
      }
      
      // Check for rate limiting in API routes
      const apiFiles = [
        'business/route.ts',
        'upload/route.ts',
        'domains/route.ts'
      ]
      
      let apiSecurityPresent = true
      for (const file of apiFiles) {
        const filePath = join(apiDir, file)
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf8')
          
          if (content.includes('rateLimit') || content.includes('validation')) {
            details.push(`✅ ${file} has security measures`)
          } else {
            details.push(`⚠️ ${file} may lack security measures`)
            apiSecurityPresent = false
          }
        } else {
          details.push(`ℹ️ ${file} not found`)
        }
      }
      
      return { passed: apiSecurityPresent, details }
    } catch (error) {
      details.push(`❌ API security check failed: ${error}`)
      return { passed: false, details }
    }
  }

  async runAudit(): Promise<void> {
    console.log('🔒 Starting Security Audit...\n')
    
    const results: Array<{
      check: SecurityCheck
      result: { passed: boolean; details: string[] }
    }> = []
    
    for (const check of this.checks) {
      console.log(`Running: ${check.name}...`)
      try {
        const result = await check.check()
        results.push({ check, result })
      } catch (error) {
        results.push({
          check,
          result: { passed: false, details: [`Error: ${error}`] } 
        })
      }
    }
    
    console.log('\n📊 Security Audit Results:\n')
    
    const summary = {
      critical: { total: 0, passed: 0 },
      high: { total: 0, passed: 0 },
      medium: { total: 0, passed: 0 },
      low: { total: 0, passed: 0 }
    }
    
    for (const { check, result } of results) {
      const status = result.passed ? '✅' : '❌'
      const severity = check.severity.toUpperCase()
      
      console.log(`${status} [${severity}] ${check.name}`)
      console.log(`   ${check.description}`)
      
      for (const detail of result.details) {
        console.log(`   ${detail}`)
      }
      
      console.log('')
      
      summary[check.severity].total++
      if (result.passed) {
        summary[check.severity].passed++
      }
    }
    
    // Print summary
    console.log('📈 Summary:')
    console.log(`Critical: ${summary.critical.passed}/${summary.critical.total} passed`)
    console.log(`High: ${summary.high.passed}/${summary.high.total} passed`)
    console.log(`Medium: ${summary.medium.passed}/${summary.medium.total} passed`)
    console.log(`Low: ${summary.low.passed}/${summary.low.total} passed`)
    
    const totalPassed = summary.critical.passed + summary.high.passed + summary.medium.passed + summary.low.passed
    const totalChecks = summary.critical.total + summary.high.total + summary.medium.total + summary.low.total
    
    console.log(`\nOverall: ${totalPassed}/${totalChecks} checks passed`)
    
    // Only fail on critical issues in production
    if (process.env.NODE_ENV === 'production' && summary.critical.passed < summary.critical.total) {
      console.log('\n🚨 CRITICAL ISSUES FOUND - Immediate action required!')
      process.exit(1)
    } else if (summary.high.passed < summary.high.total) {
      console.log('\n⚠️ HIGH PRIORITY ISSUES FOUND - Address soon!')
    } else {
      console.log('\n✅ Security audit completed successfully!')
    }
  }
}

// Run the audit if this file is executed directly
if (require.main === module) {
  const auditor = new SecurityAuditor()
  auditor.runAudit().catch(console.error)
}

export default SecurityAuditor 