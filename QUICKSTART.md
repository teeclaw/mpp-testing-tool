# Quick Start Guide

## Local Development (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# → http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

## Deploy to Vercel (5 minutes)

```bash
# Option 1: Via Vercel CLI
npm install -g vercel
vercel

# Option 2: Via GitHub (recommended)
1. Push code to GitHub
2. Go to vercel.com
3. Click "New Project"
4. Import your repo
5. Add env var: NEXT_PUBLIC_API_URL=https://mpp-testing-tool-production.up.railway.app/api
6. Click "Deploy"
```

## Environment Setup

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=https://mpp-testing-tool-production.up.railway.app/api
```

## Available Scripts

```bash
npm run dev     # Start development server
npm run build   # Create production build
npm start       # Run production server
npm run lint    # Run ESLint
```

## Features

✨ Real-time dashboard with auto-refresh every 2 seconds
📊 Live statistics (Total Tests, Success Rate, Avg Processing Time)
🧪 Test result history with status indicators
▶️ Run Test button to trigger new test cycles
📱 Fully responsive design (mobile, tablet, desktop)
🎨 Beautiful Shadcn UI components
⚡ Optimized Next.js build

## Documentation

- README.md - Full project documentation
- DEPLOYMENT.md - Detailed deployment guide
- PROJECT_STRUCTURE.md - Project architecture
- BUILD_SUMMARY.md - Build completion details

---
Ready to deploy! 🚀
