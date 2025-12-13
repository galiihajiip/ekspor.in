# Ekspor.in

Export Readiness & Market Entry Intelligence Platform for Indonesian UMKM.

## Features

- **Product Evaluation** - Analyze export readiness gaps for your products
- **Target Markets** - Explore export requirements for US, Japan, Singapore
- **Compliance Checker** - Verify documents against international standards
- **Market Signals** - AI-powered market intelligence and insights
- **Dashboard** - Overview of your export readiness status

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, Prisma ORM
- **Database**: PostgreSQL
- **AI**: Google Gemini API

## Prerequisites

- Node.js >= 18
- pnpm >= 8
- PostgreSQL database
- Google Gemini API key

## Quick Start

1. **Clone and install dependencies**
   ```bash
   pnpm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and Gemini API key
   ```

3. **Setup database**
   ```bash
   # Generate Prisma client (for 32-bit Node, use environment variables)
   set PRISMA_CLI_QUERY_ENGINE_TYPE=binary
   set PRISMA_CLIENT_ENGINE_TYPE=binary
   pnpm db:generate
   
   # Run migrations
   pnpm db:migrate
   
   # Seed sample data
   pnpm db:seed
   ```

4. **Start development servers**
   ```bash
   pnpm dev
   ```

   - Web app: http://localhost:3000
   - API: http://localhost:3001
   - API docs: http://localhost:3001/api/docs

## Project Structure

```
ekspor-in/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── prisma/          # Database schema & seeds
│   │   └── src/
│   │       ├── analysis/    # Gap analysis module
│   │       ├── compliance/  # Document compliance checker
│   │       ├── gemini/      # AI integration
│   │       ├── markets/     # Market requirements
│   │       ├── products/    # Product management
│   │       └── signals/     # Market signals
│   └── web/                 # Next.js frontend
│       └── src/
│           ├── app/         # App router pages
│           ├── components/  # UI components
│           └── lib/         # Utilities
├── .env.example
├── docker-compose.yml
└── package.json
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed sample data |
| `pnpm db:studio` | Open Prisma Studio |

## Docker Setup

```bash
# Start PostgreSQL
docker-compose up -d

# Then run migrations and seed
pnpm db:migrate
pnpm db:seed
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `API_PORT` | API server port (default: 3001) |
| `NEXT_PUBLIC_API_URL` | API URL for frontend |

## Disclaimer

This is a hackathon demo project. The data and recommendations are for demonstration purposes only and should not be used as legal or business advice. Always consult with export professionals and relevant authorities.

## License

MIT
