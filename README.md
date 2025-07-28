# Sama Sama Tour - Next.js with Supabase

A modern travel agency website built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🚀 **Next.js 15** with App Router
- 🎨 **Tailwind CSS** for styling
- 🗄️ **Supabase** for database and authentication
- 📱 **Responsive Design** with mobile-first approach
- 🔍 **SEO Optimized** with proper meta tags and structured data
- 🖼️ **Image Optimization** with Next.js Image component
- 📊 **TypeScript** for type safety
- 🎯 **Component Library** with shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sama-sama-tour
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up Supabase:
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/` in your Supabase SQL editor
   - Enable Row Level Security (RLS) for the tables

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Database Schema

### Destinations Table
- `id` (text, primary key)
- `title` (text)
- `location` (text) 
- `price` (text)
- `image` (text)
- `description` (text)
- `coordinates` (jsonb)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Testimonials Table
- `id` (uuid, primary key)
- `name` (text)
- `location` (text)
- `text` (text)
- `avatar` (text)
- `rating` (integer)
- `created_at` (timestamp)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── destination/        # Dynamic destination pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── not-found.tsx       # 404 page
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── About.tsx
│   ├── CarRental.tsx
│   ├── Contact.tsx
│   ├── Destinations.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Testimonials.tsx
│   └── WhatsAppButton.tsx
├── lib/                    # Utility functions
│   ├── supabase/           # Supabase client configuration
│   └── utils.ts
└── types/                  # TypeScript type definitions
    └── database.ts
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.