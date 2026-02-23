# 🍽️ Minu Kitchen - QR Ordering System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A modern, full-stack restaurant QR ordering system built with Next.js 16 and Fastify**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Demo](#-demo)

</div>

---

## 📖 Overview

Minu Kitchen is a comprehensive restaurant management and ordering system that allows customers to order food by scanning QR codes at their tables. The system supports real-time order tracking, multi-language interface (English/Vietnamese), and role-based access control for different user types.

### 🎯 Key Highlights

- 📱 **QR Code Ordering** - Customers scan table QR codes to access menu and place orders
- 🔄 **Real-time Updates** - Live order status updates via Socket.io
- 🌐 **Internationalization** - Full support for English and Vietnamese
- 🔐 **Role-based Access** - Separate interfaces for Guests, Employees, and Owners
- 🎨 **Modern UI** - Beautiful interface with dark/light theme support
- 📊 **Analytics Dashboard** - Comprehensive statistics and revenue tracking
- 🍕 **Menu Management** - Easy dish creation and management with image uploads
- 🪑 **Table Management** - Track table status and generate unique QR codes
- 👤 **Google OAuth** - Seamless authentication with Google accounts

---

## ✨ Features

### For Customers (Guests)
- 🔍 Browse interactive menu with dish details
- 🛒 Add items to cart and place orders
- 📱 Track order status in real-time
- 💳 View order history
- 🌍 Switch between languages

### For Employees
- 📋 Manage incoming orders
- ✅ Update order status (Pending → Cooking → Ready → Delivered)
- 🍽️ CRUD operations for dishes
- 🪑 Manage tables and QR codes
- 📊 View restaurant statistics

### For Owners
- 👥 Full employee management
- 📈 Advanced analytics and revenue reports
- 🎛️ Complete system configuration
- 📊 Dashboard with charts (Recharts)
- 💼 Account creation and role assignment

---

## 🛠️ Tech Stack

### Frontend (Client)
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.1 | React framework with App Router |
| **React** | 19.2.0 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4 | Utility-first CSS |
| **shadcn/ui** | latest | Component library (new-york style) |
| **TanStack Query** | ^5.90.9 | Server state management |
| **Zustand** | ^5.0.9 | Client state management |
| **next-intl** | ^4.6.1 | Internationalization |
| **Socket.io Client** | ^4.8.1 | Real-time communication |
| **React Hook Form** | ^7.66.0 | Form management |
| **Zod** | ^4.1.12 | Schema validation |
| **Recharts** | ^2.15.4 | Data visualization |
| **Lucide React** | ^0.553.0 | Icon library |

### Backend (Server)
| Technology | Version | Purpose |
|------------|---------|---------|
| **Fastify** | latest | High-performance Node.js framework |
| **Prisma** | latest | ORM for database |
| **PostgreSQL** | latest | Relational database |
| **Socket.io** | latest | WebSocket server |
| **JWT** | latest | Authentication |
| **Zod** | latest | Request validation |

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- npm or yarn or pnpm
- PostgreSQL database

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/minhducle25/minu-kitchen.git
cd minu-kitchen
```

2. **Install dependencies**

```bash
# Install root dependencies (if any)
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../NextJs-Super-BackEnd-main
npm install
```

3. **Setup Environment Variables**

**Client** (`client/.env`):
```env
NEXT_PUBLIC_API_ENDPOINT=http://localhost:4000
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI=http://localhost:4000/auth/login/google
```

**Server** (`NextJs-Super-BackEnd-main/.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_db"
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. **Setup Database**

```bash
cd NextJs-Super-BackEnd-main
npx prisma generate
npx prisma db push
npx prisma db seed  # Optional: seed with sample data
```

5. **Run Development Servers**

**Terminal 1 - Backend:**
```bash
cd NextJs-Super-BackEnd-main
npm run dev
# Server runs on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Client runs on http://localhost:3000
```

6. **Open your browser**
```
http://localhost:3000
```

---

## 📁 Project Structure

```
project-qr/
├── client/                          # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── [locale]/            # Internationalized routes
│   │   │   │   ├── (public)/        # Public pages (landing, menu)
│   │   │   │   ├── guest/           # Guest ordering interface
│   │   │   │   └── manage/          # Management dashboard
│   │   │   └── api/                 # API route handlers
│   │   ├── components/              # React components
│   │   │   └── ui/                  # shadcn/ui components
│   │   ├── apiRequests/             # API client functions
│   │   ├── queries/                 # TanStack Query hooks
│   │   ├── schemaValidations/       # Zod schemas
│   │   ├── lib/                     # Utilities
│   │   ├── i18n/                    # i18n configuration
│   │   └── types/                   # TypeScript types
│   ├── messages/                    # Translation files
│   │   ├── en.json
│   │   └── vi.json
│   └── public/                      # Static assets
│
└── NextJs-Super-BackEnd-main/       # Fastify Backend Application
    ├── src/
    │   ├── controllers/             # Route controllers
    │   ├── routes/                  # API routes
    │   ├── schemaValidations/       # Request validation
    │   ├── plugins/                 # Fastify plugins
    │   ├── jobs/                    # Background jobs
    │   └── utils/                   # Utilities
    ├── prisma/
    │   └── schema.prisma            # Database schema
    └── uploads/                     # Uploaded files
```

---

## 🎨 Screenshots

### Landing Page
Beautiful landing page with featured dishes and responsive design.

### QR Code Ordering Flow
1. Customer scans QR code at table
2. Menu loads with available dishes
3. Add items to cart and checkout
4. Real-time order tracking

### Management Dashboard
- Order management interface
- Dish CRUD operations
- Table management with QR generation
- Analytics and revenue charts

---

## 🌐 API Documentation

The backend API follows RESTful conventions and includes:

- **Authentication API** (`/api/auth/*`)
  - `POST /auth/login` - Login with email/password
  - `POST /auth/login/google` - Google OAuth login
  - `POST /auth/refresh-token` - Refresh access token
  - `POST /auth/logout` - Logout

- **Dish API** (`/api/dishes/*`)
  - `GET /dishes` - List all dishes
  - `GET /dishes/:id` - Get dish details
  - `POST /dishes` - Create new dish (Employee+)
  - `PUT /dishes/:id` - Update dish (Employee+)
  - `DELETE /dishes/:id` - Delete dish (Employee+)

- **Order API** (`/api/orders/*`)
  - `GET /orders` - List orders
  - `POST /orders` - Create order (Guest)
  - `PATCH /orders/:id` - Update order status (Employee+)

- **Table API** (`/api/tables/*`)
  - `GET /tables` - List all tables
  - `POST /tables` - Create table (Employee+)
  - `PATCH /tables/:id` - Update table (Employee+)

- **Account API** (`/api/accounts/*`)
  - `GET /accounts` - List accounts (Owner only)
  - `POST /accounts` - Create account (Owner only)
  - `PUT /accounts/:id` - Update account (Owner only)

---

## 🔒 Authentication & Authorization

### User Roles

1. **Guest** - Temporary users accessing via QR code
   - Can browse menu and place orders
   - Limited to specific table

2. **Employee** - Restaurant staff
   - Manage orders and update status
   - CRUD operations for dishes and tables
   - View statistics

3. **Owner** - Restaurant owner/admin
   - Full system access
   - Account management
   - Advanced analytics

### Token Management

- JWT-based authentication
- Access token (short-lived)
- Refresh token (long-lived, stored in cookies)
- Automatic token refresh before expiry
- Role-based route protection in middleware

---

## 🌍 Internationalization

The application supports multiple languages using `next-intl`:

- **English (en)** - `/en/*`
- **Vietnamese (vi)** - `/vi/*` (default)

### Adding a New Language

1. Create translation file: `client/messages/[lang].json`
2. Update `src/i18n/routing.ts` with new locale
3. Update `src/config.ts` to include locale
4. Translations are automatically applied

---

## 🧪 Testing

```bash
# Frontend
cd client
npm run lint
npm run build

# Backend
cd NextJs-Super-BackEnd-main
npm run lint
npm run build
```

---

## 📦 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

```bash
cd client
npm run build
npm run start
```

### Backend (Railway/Render/DigitalOcean)

1. Setup PostgreSQL database
2. Set environment variables
3. Run migrations
4. Start server

```bash
cd NextJs-Super-BackEnd-main
npx prisma migrate deploy
npm run build
npm run start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Min**
- GitHub: [@minhducle25](https://github.com/minhducle25)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Fastify](https://www.fastify.io/) - Fast web framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Socket.io](https://socket.io/) - Real-time engine

---

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact via email

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

Made with ❤️ by [Min]

</div>
