# 🚀 Spatium V2 Production Deployment Guide

This guide covers deploying Spatium V2 to production with optimal performance and security.

## Prerequisites

- [x] Google AI API key obtained
- [x] Vercel account created
- [x] Git repository ready
- [x] Domain name (optional)

## Pre-Deployment Checklist

### 1. Code Quality
```bash
# Run linting
npm run lint:fix

# Type checking
npm run type-check

# Test production build
npm run test:build
```

### 2. Environment Setup
- [ ] Set up `.env.local` with production values
- [ ] Verify API key works with test requests
- [ ] Remove any debug code or console.logs
- [ ] Update meta tags and SEO information

### 3. Performance Optimization
- [ ] Compress images and assets
- [ ] Verify bundle size is under limits
- [ ] Test loading performance
- [ ] Enable service worker (if applicable)

## Deployment Methods

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Configure Project**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add GOOGLE_AI_API_KEY production
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Select "spatium-v2" folder as root

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   ```
   GOOGLE_AI_API_KEY=your_actual_key_here
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy" and wait for build completion

## Post-Deployment Verification

### 1. Functionality Testing
- [ ] Dashboard loads correctly
- [ ] Project creation works
- [ ] AI generation functions
- [ ] Custom templates save/load
- [ ] All themes work properly
- [ ] Drag and drop functions
- [ ] Modal dialogs open/close
- [ ] Local storage persists

### 2. Performance Testing
- [ ] Page load speed < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Mobile responsiveness
- [ ] AI API response time < 10 seconds
- [ ] No console errors in production

### 3. Security Testing
- [ ] API key not exposed in client
- [ ] CORS headers properly configured
- [ ] No sensitive data in localStorage
- [ ] HTTPS enforced
- [ ] Security headers present

## Production Configuration

### Custom Domain Setup

1. **Add Domain in Vercel**
   ```bash
   vercel domains add yourdomain.com
   ```

2. **Configure DNS**
   - Add CNAME record pointing to your Vercel deployment
   - Verify SSL certificate is issued

### Analytics Integration

1. **Google Analytics (Optional)**
   ```javascript
   // Add to index.html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

2. **Performance Monitoring**
   - Monitor Core Web Vitals
   - Set up error tracking
   - Monitor API usage

### CDN and Caching

Vercel automatically provides:
- Global CDN
- Automatic compression
- Smart caching headers
- Image optimization

## Monitoring and Maintenance

### 1. Regular Health Checks
```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Monitor function usage
vercel inspect [deployment-url]
```

### 2. Performance Monitoring
- Monitor Lighthouse scores weekly
- Track Core Web Vitals
- Monitor AI API usage and costs
- Check error rates and response times

### 3. Updates and Rollbacks
```bash
# Deploy new version
vercel --prod

# Rollback if needed
vercel rollback [deployment-url]
```

## Troubleshooting

### Common Issues

**Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

**API Issues**
- Verify environment variables are set
- Check Google AI API quota and billing
- Monitor function logs for errors

**Performance Issues**
- Analyze bundle size with `npm run build:analyze`
- Optimize images and assets
- Review and optimize component rendering

**CORS Errors**
- Verify vercel.json headers configuration
- Check API endpoint URLs
- Ensure proper environment variable setup

### Emergency Procedures

**Service Disruption**
1. Check Vercel status page
2. Verify API key validity
3. Roll back to last known good deployment
4. Monitor error logs and user reports

**Data Loss Prevention**
- localStorage data is client-side only
- Consider implementing cloud backup
- Document recovery procedures

## Security Best Practices

### 1. API Security
- Never expose API keys in client code
- Use environment variables for all secrets
- Implement rate limiting if needed
- Monitor API usage patterns

### 2. Client Security
- Validate all user inputs
- Sanitize data before storage
- Use HTTPS everywhere
- Implement CSP headers

### 3. Data Protection
- Minimize data collection
- Respect user privacy
- Implement data retention policies
- Consider GDPR compliance if applicable

## Support and Documentation

### Internal Documentation
- Keep deployment procedures updated
- Document all environment variables
- Maintain troubleshooting guides
- Record configuration changes

### User Support
- Monitor user feedback
- Track common issues
- Maintain FAQ documentation
- Provide clear error messages

---

## Quick Reference

**Deployment Commands**
```bash
# Production deploy
vercel --prod

# Environment variables
vercel env add [KEY] [ENVIRONMENT]

# Logs
vercel logs [DEPLOYMENT_URL]

# Domains
vercel domains add [DOMAIN]
```

**Important URLs**
- Production: `https://your-app.vercel.app`
- Analytics: Vercel Dashboard
- Logs: Vercel Functions tab
- Domain: Vercel Domains tab

**Emergency Contacts**
- Vercel Support: [support.vercel.com](https://support.vercel.com)
- Google AI Support: [cloud.google.com/support](https://cloud.google.com/support)

---

*Last updated: September 2, 2025 - Spatium V2.0.0*
