# Minu Kitchen - Frontend Client

This is the Next.js 16 frontend application for the Minu Kitchen QR ordering system.

For complete project documentation, please see the [main README](../README.md).

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library
- **TanStack Query** - Server state management
- **next-intl** - Internationalization

## Project Structure

```
client/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── apiRequests/      # API client functions
│   ├── queries/          # TanStack Query hooks
│   ├── lib/              # Utilities
│   └── i18n/             # Internationalization
├── messages/             # Translation files
└── public/               # Static assets
```

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_API_ENDPOINT=http://localhost:4000
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI=http://localhost:4000/auth/login/google
```

## Documentation

- [Main Project README](../README.md)
- [Agents Documentation](../AGENTS.md)
- [i18n Setup Guide](./docs/i18n-setup-guide.md)

## License

MIT License - see [LICENSE](../LICENSE) for details.
