# Security Documentation

## Overview

BizPlanNaija implements comprehensive security measures to protect user data, prevent attacks, and ensure compliance with security best practices.

## Security Features

### 🔐 Authentication & Authorization

- **Firebase Authentication**: Secure user authentication with email/password and social providers
- **JWT Tokens**: Secure session management with configurable expiration
- **Role-Based Access Control**: Different access levels for users, premium users, and admins
- **Session Security**: Secure, HTTP-only cookies with proper SameSite configuration

### 🛡️ Input Validation & Sanitization

- **Zod Schema Validation**: Type-safe input validation for all API endpoints
- **DOMPurify Integration**: XSS prevention through HTML sanitization
- **SQL Injection Prevention**: Input sanitization for database queries
- **File Upload Validation**: Type and size restrictions for uploaded files

### 🚦 Rate Limiting

- **API Rate Limiting**: Configurable rate limits for different endpoints
- **Authentication Rate Limiting**: Stricter limits for login attempts
- **Business Creation Limits**: Prevents spam and abuse
- **Upload Rate Limiting**: Controls file upload frequency

### 🔒 Security Headers

- **Content Security Policy (CSP)**: Prevents XSS and injection attacks
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Strict-Transport-Security**: Enforces HTTPS
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

### 💾 Data Protection

- **Environment Variable Validation**: Ensures all required secrets are properly configured
- **Secure Database Access**: Firebase Admin SDK with proper authentication
- **Data Encryption**: All sensitive data encrypted in transit and at rest
- **Input Sanitization**: All user inputs sanitized before storage

### 📊 Monitoring & Logging

- **Error Monitoring**: Comprehensive error tracking and reporting
- **Security Event Logging**: All security-relevant events logged
- **API Request Logging**: Detailed request/response logging
- **Performance Monitoring**: Cache and rate limiting statistics

## Security Configuration

### Environment Variables

Required environment variables for security:

```bash
# Firebase (Required)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Cloudinary (Required)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Paystack (Required)
PAYSTACK_SECRET_KEY=your-secret-key
PAYSTACK_PUBLIC_KEY=your-public-key

# Security (Recommended)
JWT_SECRET=your-32-character-jwt-secret
NEXTAUTH_SECRET=your-32-character-nextauth-secret
NEXTAUTH_URL=https://your-domain.com

# Vercel (Optional)
VERCEL_API_TOKEN=your-vercel-token
VERCEL_PROJECT_ID=your-project-id

# Monitoring (Optional)
ERROR_WEBHOOK_URL=your-error-webhook-url
```

### Rate Limiting Configuration

```typescript
// Default: 100 requests per 15 minutes
DEFAULT: { windowMs: 15 * 60 * 1000, maxRequests: 100 }

// Authentication: 5 attempts per 15 minutes
AUTH: { windowMs: 15 * 60 * 1000, maxRequests: 5 }

// Business Creation: 10 businesses per hour
BUSINESS_CREATE: { windowMs: 60 * 60 * 1000, maxRequests: 10 }

// File Uploads: 20 uploads per hour
UPLOAD: { windowMs: 60 * 60 * 1000, maxRequests: 20 }
```

### Caching Configuration

```typescript
// Cache TTLs (in seconds)
BUSINESS: 300,        // 5 minutes
USER_BUSINESSES: 180, // 3 minutes
ANALYTICS: 600,       // 10 minutes
USER_PLAN: 900,       // 15 minutes
```

## Security Best Practices

### For Developers

1. **Never commit secrets**: All sensitive data should be in environment variables
2. **Validate all inputs**: Use the provided validation schemas
3. **Sanitize user content**: Use DOMPurify for HTML content
4. **Log security events**: Use the provided logging functions
5. **Follow rate limiting**: Respect rate limits in your code

### For Deployment

1. **Use HTTPS**: Always deploy with SSL/TLS
2. **Set strong secrets**: Use 32+ character random strings
3. **Regular updates**: Keep dependencies updated
4. **Monitor logs**: Set up error monitoring
5. **Backup data**: Regular database backups

### For Users

1. **Strong passwords**: Use unique, strong passwords
2. **Two-factor authentication**: Enable 2FA when available
3. **Regular updates**: Keep browsers and devices updated
4. **Secure networks**: Avoid public Wi-Fi for sensitive operations

## Security Audit

Run the security audit to check your deployment:

```bash
npm run security-audit
```

This will check:
- ✅ Environment variable configuration
- ✅ Rate limiting setup
- ✅ Caching configuration
- ✅ Package vulnerabilities
- ✅ Security headers
- ✅ Input validation
- ✅ Authentication setup
- ✅ File upload security
- ✅ Database security
- ✅ API endpoint security

## Incident Response

### Security Breach Response

1. **Immediate Actions**:
   - Isolate affected systems
   - Preserve evidence
   - Notify security team

2. **Investigation**:
   - Review logs and monitoring data
   - Identify root cause
   - Assess impact

3. **Remediation**:
   - Fix vulnerabilities
   - Update security measures
   - Notify affected users

4. **Post-Incident**:
   - Document lessons learned
   - Update security procedures
   - Conduct security review

### Contact Information

For security issues:
- Email: security@bizplannaija.com
- Bug bounty: https://bizplannaija.com/security
- Responsible disclosure: Please report vulnerabilities privately

## Compliance

### GDPR Compliance

- **Data Minimization**: Only collect necessary data
- **User Consent**: Clear consent mechanisms
- **Data Portability**: Export user data on request
- **Right to Deletion**: Delete user data on request
- **Data Protection**: Encrypt all personal data

### SOC 2 Compliance

- **Security**: Comprehensive security controls
- **Availability**: High availability infrastructure
- **Processing Integrity**: Data accuracy and completeness
- **Confidentiality**: Protect sensitive information
- **Privacy**: Protect personal information

## Security Updates

### Recent Updates

- **v1.2.0**: Added comprehensive input validation
- **v1.1.0**: Implemented rate limiting
- **v1.0.0**: Initial security implementation

### Upcoming Features

- **v1.3.0**: Advanced threat detection
- **v1.4.0**: Enhanced monitoring
- **v1.5.0**: Compliance automation

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Headers](https://securityheaders.com/)
- [Mozilla Security Guidelines](https://infosec.mozilla.org/guidelines/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers) 