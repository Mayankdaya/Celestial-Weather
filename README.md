# Celestial Weather

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

AI-powered weather application delivering real-time meteorological data with intelligent activity recommendations through a premium glassmorphism interface.

## Features

- **Real-time Weather Data** - Current conditions, 5-day forecast, hourly trends
- **AI Recommendations** - Personalized activity and location suggestions via Genkit
- **Health Metrics** - Air quality index, PM2.5, ozone, and pollen data
- **Interactive Charts** - Hourly temperature visualization with Recharts
- **Modern UI** - Responsive glassmorphism design with animated backgrounds

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **AI:** Google Genkit
- **Styling:** Tailwind CSS + ShadCN UI
- **Charts:** Recharts

## Quick Start

```bash
git clone https://github.com/your-username/celestial-weather.git
cd celestial-weather
npm install
echo "GEMINI_API_KEY=your_api_key" > .env
npm run dev
```

Visit `http://localhost:9002`

## Deployment

Deploy to Vercel with one command:

```bash
npx vercel --prod
```

Add your `GEMINI_API_KEY` environment variable in the Vercel dashboard.

## License

MIT License
