# Deployment Guide

This guide covers deploying BizPlanNaija to production environments.

## 🚀 Pre-Deployment Checklist

### Environment Setup
- [ ] All environment variables configured
- [ ] Firebase project created and configured
- [ ] Cloudinary account set up
- [ ] Paystack account configured
- [ ] Vercel account ready (for custom domains)

### Code Quality
- [ ] All tests passing
- [ ] Security audit passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code formatted with Prettier

### Performance
- [ ] Images optimized
- [ ] Bundle size acceptable
- [ ] Core Web Vitals optimized
- [ ] Caching configured

## 📋 Environment Variables

### Required for Production

```bash
# Firebase
FIREBASE_PROJECT_ID=your-production-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Production Private Key\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your-production-service-account@your-project.iam.gserviceaccount.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-production-cloud-name
CLOUDINARY_API_KEY=your-production-api-key
CLOUDINARY_API_SECRET=your-production-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-production-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-production-upload-preset

# Paystack
PAYSTACK_SECRET_KEY=sk_live_your-production-secret-key
PAYSTACK_PUBLIC_KEY=pk_live_your-production-public-key

# Security
JWT_SECRET=your-32-character-production-jwt-secret
NEXTAUTH_SECRET=your-32-character-production-nextauth-secret
NEXTAUTH_URL=https://your-domain.com

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-admin-password

# Optional
VERCEL_API_TOKEN=your-vercel-api-token
VERCEL_PROJECT_ID=your-vercel-project-id
ERROR_WEBHOOK_URL=https://your-error-webhook-url.com
```

## 🌐 Domain Configuration

### Custom Domain Setup

1. **Purchase domain** (if not already owned)
2. **Configure DNS**:
   ```
   A     @     76.76.19.19
   CNAME www   your-domain.com
   ```
3. **Add domain to Vercel**:
   - Go to Vercel dashboard
   - Add domain to your project
   - Configure SSL certificate

### Subdomain Setup

For admin panel or API:
```
admin.your-domain.com
api.your-domain.com
```

## 🔧 Vercel Deployment

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

### 2. Environment Variables

Add all required environment variables in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add each variable from the list above
- Set environment to "Production"

### 3. Build Configuration

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### 4. Deploy

1. Push to main branch
2. Vercel will auto-deploy
3. Monitor build logs
4. Test deployed application

## 🔒 Security Configuration

### SSL/TLS

- Vercel provides automatic SSL certificates
- Ensure HTTPS is enforced
- Configure HSTS headers

### Security Headers

Already configured in `next.config.mjs`:
- X-Frame-Options
- X-Content-Type-Options
- Content-Security-Policy
- Strict-Transport-Security

### Rate Limiting

Configured in `lib/rate-limit.ts`:
- API endpoints: 100 requests/15min
- Authentication: 5 attempts/15min
- File uploads: 20 uploads/hour

## 📊 Monitoring Setup

### Error Tracking

1. **Set up error webhook**:
   ```bash
   ERROR_WEBHOOK_URL=https://your-error-tracking-service.com
   ```

2. **Configure logging**:
   - Application logs
   - Error logs
   - Performance metrics

### Analytics

1. **Google Analytics**:
   ```bash
   GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

2. **Vercel Analytics**:
   - Enable in Vercel dashboard
   - Monitor Core Web Vitals

## 🗄️ Database Setup

### Firebase Configuration

1. **Create production project**:
   - Go to Firebase Console
   - Create new project
   - Enable Firestore Database

2. **Set up security rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Your security rules here
     }
   }
   ```

3. **Configure indexes**:
   - Create composite indexes for queries
   - Optimize for common queries

### Data Migration

1. **Export development data** (if needed):
   ```bash
   firebase firestore:export ./backup
   ```

2. **Import to production**:
   ```bash
   firebase firestore:import ./backup
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      - run: pnpm security-audit
```

## 🧪 Post-Deployment Testing

### Functionality Tests

- [ ] User registration/login
- [ ] Business creation
- [ ] File uploads
- [ ] Payment processing
- [ ] Admin panel access
- [ ] Custom domain setup

### Performance Tests

- [ ] Page load times
- [ ] API response times
- [ ] Image optimization
- [ ] Mobile responsiveness

### Security Tests

- [ ] Authentication flows
- [ ] Authorization checks
- [ ] Input validation
- [ ] File upload security
- [ ] Rate limiting

## 📈 Monitoring & Maintenance

### Regular Checks

- **Daily**: Monitor error logs
- **Weekly**: Check performance metrics
- **Monthly**: Security audit
- **Quarterly**: Dependency updates

### Backup Strategy

1. **Database backups**:
   - Firebase automatic backups
   - Manual exports for critical data

2. **Code backups**:
   - GitHub repository
   - Vercel deployment history

### Scaling Considerations

- Monitor usage patterns
- Set up alerts for high usage
- Plan for database scaling
- Consider CDN for global users

## 🚨 Troubleshooting

### Common Issues

1. **Build failures**:
   - Check environment variables
   - Verify dependencies
   - Review build logs

2. **Runtime errors**:
   - Check application logs
   - Verify API endpoints
   - Test database connections

3. **Performance issues**:
   - Optimize images
   - Review bundle size
   - Check caching configuration

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Project Issues](https://github.com/your-repo/issues)

## 📞 Emergency Procedures

### Rollback Process

1. **Vercel rollback**:
   - Go to Vercel dashboard
   - Select previous deployment
   - Promote to production

2. **Database rollback**:
   - Restore from backup
   - Revert data changes

### Contact Information

- **Technical issues**: GitHub Issues
- **Security issues**: Security email
- **Emergency**: Emergency contact

---

**Remember**: Always test in staging environment before deploying to production! 