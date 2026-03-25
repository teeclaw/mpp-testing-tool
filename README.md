# MPP Testing Tool - Frontend

A modern, production-ready dashboard for the MPP Testing Tool built with Next.js, TypeScript, Tailwind CSS, and Shadcn UI.

## Features

- **Real-time Dashboard**: Live statistics including total tests, success rate, and average processing time
- **Auto-refresh**: Dashboard automatically updates every 2 seconds
- **Test Management**: Run new tests directly from the dashboard
- **Test Results**: View recent test results with status indicators
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Built with Shadcn UI components for a polished look

## Tech Stack

- **Next.js 15+** - React framework with hybrid static/server rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - High-quality React components
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful SVG icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mpp-testing-tool.git
cd mpp-testing-tool/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` to set your backend API URL (default is already set to Railway production).

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

### Linting

```bash
npm run lint
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard if needed.

### Deploy to Other Platforms

This is a standard Next.js application and can be deployed to any Node.js hosting platform.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: `https://mpp-testing-tool-production.up.railway.app/api`)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/
│   ├── Dashboard.tsx   # Main dashboard component
│   └── ui/             # Shadcn UI components
├── lib/
│   ├── api.ts          # API client and types
│   └── utils.ts        # Utility functions
```

## API Integration

The dashboard connects to the MPP Testing Tool backend API with the following endpoints:

- `GET /api/stats` - Get dashboard statistics
- `GET /api/test-results` - Get recent test results
- `POST /api/run-test` - Run a new test
- `GET /api/test-results/:id` - Get specific test result

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Contact

For questions or support, please contact Harry or the development team.
