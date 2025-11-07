# Deployment Guide

## 🚀 Quick Deployment Links

### GitHub Repository
**Repository URL:** https://github.com/bhargabparthabora123/Performance-Critical-Data-Visualization-Dashboard

### Live Demo
**Demo URL:** https://3000-i7l0q85gf8qkklxsgy2ut-2e1b9533.sandbox.novita.ai

## 📦 Deployment Options

### Option 1: Vercel (Recommended for Next.js)

Vercel is the recommended platform as it's created by the Next.js team and provides optimal performance.

#### Deploy via CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /path/to/performance-dashboard
vercel
```

#### Deploy via GitHub Integration
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `Performance-Critical-Data-Visualization-Dashboard` repository
5. Click "Deploy"

**Configuration:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

**netlify.toml** (if needed):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Option 3: Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t performance-dashboard .
docker run -p 3000:3000 performance-dashboard
```

### Option 4: Traditional Node.js Hosting

```bash
# Build the application
npm run build

# Start the production server
npm start
```

**Requirements:**
- Node.js 18.0 or higher
- Port 3000 (configurable via PORT env variable)
- At least 512MB RAM

## 🔧 Environment Variables

Create a `.env.local` file for local development:

```bash
# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Optional: API Configuration
NEXT_PUBLIC_API_URL=https://your-api.com

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_WEBWORKERS=true
NEXT_PUBLIC_MAX_DATA_POINTS=50000
```

## 📊 Performance Optimization for Production

### 1. Enable Compression
Most hosting platforms enable gzip/brotli automatically. Verify with:
```bash
curl -H "Accept-Encoding: gzip" -I https://your-domain.com
```

### 2. CDN Configuration
- Static assets are automatically optimized by Next.js
- Images (if added) should use Next.js Image component
- Consider using Vercel Edge Network or Cloudflare CDN

### 3. Monitoring Setup

#### Vercel Analytics
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### Custom Performance Monitoring
Already built-in via `PerformanceMonitor` component!

## 🌐 Domain Configuration

### Custom Domain on Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS:
   - Type: `A` Record
   - Name: `@` or subdomain
   - Value: Vercel's IP (provided)
   
   OR
   
   - Type: `CNAME`
   - Name: subdomain
   - Value: `cname.vercel-dns.com`

### SSL Certificate
- Automatically provisioned on Vercel/Netlify
- Let's Encrypt for custom servers:
```bash
sudo certbot --nginx -d yourdomain.com
```

## 🔍 Health Check Endpoint

Already available at:
```
GET /api/data
```

Returns JSON with sample data to verify API is working.

## 📈 Scaling Considerations

### Horizontal Scaling
- Next.js App Router is stateless and scales horizontally
- Use load balancer (nginx, AWS ALB, etc.)
- No session state to manage

### Vertical Scaling
Current requirements:
- **Minimum**: 512MB RAM, 1 CPU
- **Recommended**: 1GB RAM, 2 CPUs
- **Heavy Load**: 2GB RAM, 4 CPUs

### Performance Targets
- Time to First Byte: < 200ms
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- 60 FPS with 10k data points

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Change port
PORT=3001 npm start
```

### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Canvas Not Rendering
- Ensure client components marked with `'use client'`
- Check browser console for errors
- Verify Canvas API support in browser

## 📱 Mobile Optimization

The dashboard is fully responsive, but for optimal mobile performance:

1. **Reduce Initial Data Points**: Consider 5,000 for mobile
2. **Disable Animation**: Set `animate={false}` on charts
3. **Touch Events**: Already implemented in filter controls

## 🔐 Security Checklist

- ✅ No sensitive data in client-side code
- ✅ API routes use proper HTTP methods
- ✅ No eval() or dangerous HTML injection
- ✅ Dependencies regularly updated
- ✅ Environment variables for secrets

## 📊 Analytics & Monitoring

### Built-in Metrics
The dashboard includes:
- Real-time FPS counter
- Memory usage tracking
- Render time monitoring
- Data processing time

### External Monitoring (Optional)
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user behavior
- Vercel Analytics for performance insights

## 🎯 Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test dashboard with 10k+ data points
- [ ] Check FPS counter shows 60fps
- [ ] Test on mobile devices
- [ ] Verify all interactive controls work
- [ ] Check memory usage stays stable
- [ ] Test real-time data streaming
- [ ] Verify production build is optimized
- [ ] Set up monitoring/analytics
- [ ] Configure custom domain (if applicable)

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/bhargabparthabora123/Performance-Critical-Data-Visualization-Dashboard/issues
- Email: bhargabparthabora123@gmail.com

---

**Last Updated:** November 7, 2024
**Next.js Version:** 14.2.33
**Node.js Version:** 18+
