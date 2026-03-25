# Deployment Guide - MPP Testing Tool Frontend

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

### Production Build

```bash
npm run build
npm start
```

## Vercel Deployment

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to connect your GitHub repository

4. Configure environment variables:
   - Add `NEXT_PUBLIC_API_URL` with your Railway backend URL
   - Default: `https://mpp-testing-tool-production.up.railway.app/api`

5. Your app will be deployed to a Vercel URL automatically

### Option 2: GitHub Integration

1. Push code to GitHub:
```bash
git remote add origin https://github.com/yourusername/mpp-testing-tool.git
git branch -M main
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)

3. Sign in with GitHub

4. Click "New Project"

5. Import your GitHub repository

6. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: https://mpp-testing-tool-production.up.railway.app/api

7. Click "Deploy"

## Environment Variables

### Development (.env.local)
```
NEXT_PUBLIC_API_URL=https://mpp-testing-tool-production.up.railway.app/api
```

### Production (Vercel Dashboard)
- Go to Project Settings → Environment Variables
- Add the same `NEXT_PUBLIC_API_URL` variable

## API Configuration

The frontend expects these endpoints from the backend:

- `GET /api/stats` - Returns dashboard statistics
- `GET /api/test-results` - Returns list of recent test results
- `POST /api/run-test` - Triggers a new test run
- `GET /api/test-results/:id` - Returns specific test details

## Performance Optimizations

This project includes:

- **Next.js 16**: Latest React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS with PurgeCSS
- **Shadcn UI**: Pre-optimized components
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic per-route code splitting
- **Static Generation**: Pre-rendered pages where possible

## Monitoring

After deployment:

1. Check Vercel Dashboard for deployment status
2. Monitor Real-time Analytics in Vercel dashboard
3. Check function logs for any errors
4. Monitor API response times

## Troubleshooting

### Backend Connection Issues
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check backend is running at the specified URL
- Ensure CORS is configured on the backend

### Build Failures
- Check Node.js version is 18 or higher
- Clear `.next` folder: git clean -fdx .next
- Reinstall dependencies: rm -rf node_modules && npm install

### Performance Issues
- Open DevTools → Network tab
- Check API response times
- Monitor Vercel Analytics dashboard

## Rollback

### If deployment has issues:

```bash
# View deployment history
vercel list

# Rollback to previous deployment
vercel rollback
```

Or redeploy from GitHub:
```bash
git push
# Vercel will automatically redeploy
```

## Support

For issues:
1. Check Vercel docs: https://vercel.com/docs
2. Check Next.js docs: https://nextjs.org/docs
3. Check backend API logs for errors
