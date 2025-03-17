# EventMaster

A full-stack TypeScript application for event management, built with Vite, Express, and PostgreSQL.

## Features

- 🎯 Event creation and management
- 👥 User authentication and authorization
- 📅 Event scheduling and calendar integration
- 📱 Responsive design
- 🔒 Secure API endpoints
- 📊 Real-time updates
- 📝 Rich text editor for event descriptions

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Styling**: Tailwind CSS
- **Authentication**: Passport.js
- **API Documentation**: OpenAPI/Swagger

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v16 or higher)
- npm or yarn

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/eventmaster.git
   cd eventmaster
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check
- `npm run db:push` - Push database schema
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Project Structure

```
eventmaster/
├── src/              # Frontend source code
├── server/           # Backend source code
├── shared/           # Shared types and utilities
├── public/           # Static assets
└── dist/            # Production build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
