# 🚀 API Pilot - Modern API Testing & Collaboration Platform

<div align="center">
  <img src="./public/ApiPilot.gif" alt="API Pilot Logo" width="120" />
  
  <h3>The powerful Postman alternative built for modern development teams</h3>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-316192?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  
  [Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Architecture](#-architecture) • [Contributing](#-contributing)
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Configuration](#-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**API Pilot** is a next-generation API testing and collaboration platform designed to streamline your development workflow. Built with modern web technologies, it offers a seamless experience for testing REST APIs, managing collections, and collaborating with your team in real-time.

### Why API Pilot?

- **🎨 Beautiful UI/UX**: Modern, responsive interface with smooth animations
- **⚡ Lightning Fast**: Built on Next.js 16 with optimized performance
- **🔒 Secure**: Authentication powered by Better Auth with OAuth providers
- **🤝 Team Collaboration**: Workspace-based collaboration with invite system
- **📦 Organized**: Collections and environments for structured API management
- **🎯 Developer-Friendly**: Keyboard shortcuts, auto-save, and intuitive design

---

## ✨ Features

### ✅ Verified Working Features

All core features have been tested and verified working in production:

#### 🔌 API Testing
- **REST API Support**: ✅ All HTTP methods tested and working
  - ✅ GET - Fetch data from APIs
  - ✅ POST - Create new resources
  - ✅ PUT - Update/replace entire resources
  - ✅ PATCH - Partially update resources
  - ✅ DELETE - Remove resources
- **Request Builder**: Intuitive interface for building complex API requests
- **Response Viewer**: Full response display with status codes, timing, and size
  - Status code display (200, 404, 500, etc.)
  - Response time in milliseconds
  - Response size calculation
  - Pretty-printed JSON responses
- **Headers & Parameters**: Custom headers and query parameters support
- **Request Body**: JSON body support for POST, PUT, PATCH requests
- **Error Handling**: Comprehensive error handling with timeout (30s) and network error capture

#### 📁 Collections
- **Organize Requests**: Group related requests into collections
- **Full CRUD Operations**: ✅ Create, Read, Update, Delete collections
- **Edit Collections**: Rename and modify collections through UI
- **Delete Collections**: Remove collections with confirmation
- **Add Requests**: Add multiple requests to each collection
- **Visual Organization**: Color-coded collections for easy identification

#### 🌍 Environments
- **Variable Management**: Define environment-specific variables
- **Quick Switching**: Seamlessly switch between dev, staging, and production
- **Secure Storage**: Encrypted storage for sensitive variables
- **Scope Control**: Global and local variable scopes

#### 👥 Workspace Collaboration
- **Multi-user Workspaces**: ✅ Create and manage team workspaces
- **Role-based Access**: ✅ Admin, Editor, and Viewer roles
- **Invite System**: ✅ Secure token-based workspace invitations
  - Email invitations with unique tokens
  - Auth-protected invite acceptance
  - Automatic redirect after sign-in
- **Workspace Switching**: ✅ Easy switching between workspaces with single checkmark indicator

#### ⚡ WebSocket Testing
- **Folder Structure**: Ready for implementation at `src/modules/websocket/`
- **Placeholder**: Basic structure in place for future development
- **Coming Soon**: Real-time WebSocket connection testing

#### 📝 Request History
- **Auto-save**: Automatically saves all executed requests
- **Quick Access**: Recent requests accessible from header
- **Search & Filter**: Find past requests quickly
- **Restore**: One-click restore of previous requests

### User Experience

#### ⌨️ Keyboard Shortcuts
- `Ctrl/Cmd + K`: Open command palette
- `Ctrl/Cmd + S`: Save current request
- `Ctrl/Cmd + Shift + N`: Create new request
- `Ctrl/Cmd + ?`: Show keyboard shortcuts
- And many more...

#### 🎨 UI/UX Features
- **Dark Mode**: Eye-friendly dark theme optimized for developers
- **Responsive Design**: Works seamlessly on all device sizes
- **Animated Icons**: Smooth, delightful micro-interactions
- **Glass Morphism**: Modern glassmorphic design elements
- **Custom Scrollbars**: Themed scrollbars for consistency

#### 🔍 Search
- **Global Search**: Search across collections, requests, and environments
- **Fuzzy Matching**: Smart search with typo tolerance
- **Quick Navigation**: Jump to any resource instantly

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Re-usable component library
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) - Performant forms
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful SVG icons

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) - JavaScript runtime
- **API**: [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - Serverless functions
- **Authentication**: [Better Auth](https://www.better-auth.com/) - Modern auth solution
- **Database ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM

### Database
- **Primary Database**: [PostgreSQL](https://www.postgresql.org/) - Relational database
- **Database Client**: Prisma Client - Type-safe database access
- **Migrations**: Prisma Migrate - Database schema migrations

### Development Tools
- **Package Manager**: npm - Node package manager
- **Code Quality**: ESLint - Linting utility
- **Formatting**: Prettier - Code formatter (via Tailwind plugin)
- **Version Control**: Git - Distributed version control

### DevOps
- **Containerization**: Docker - Container platform
- **Container Orchestration**: Docker Compose - Multi-container Docker applications

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** >= 18.x
- **npm** >= 9.x
- **Docker** & **Docker Compose** (for database)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/api-pilot.git
   cd api-pilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/api_pilot"
   
   # Auth
   BETTER_AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3000"
   
   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. **Start the database**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing API Requests

API Pilot supports all standard HTTP methods. Here's how to test each one:

### ✅ Verified Working HTTP Methods

All methods have been tested and are working properly. The application uses Axios with comprehensive error handling and supports:

#### GET Request
Used to retrieve data from a server.

**Example:**
```
Method: GET
URL: https://jsonplaceholder.typicode.com/posts/1
```

**Expected Response:**
- Status: 200 OK
- Response Time: ~50-200ms
- Response Body: JSON object with post data

#### POST Request
Used to create new resources.

**Example:**
```
Method: POST
URL: https://jsonplaceholder.typicode.com/posts
Headers: 
  Content-Type: application/json
Body:
{
  "title": "Test Post",
  "body": "This is a test",
  "userId": 1
}
```

**Expected Response:**
- Status: 201 Created
- Response includes the created resource with an ID

#### PUT Request
Used to update/replace an entire resource.

**Example:**
```
Method: PUT
URL: https://jsonplaceholder.typicode.com/posts/1
Headers:
  Content-Type: application/json
Body:
{
  "id": 1,
  "title": "Updated Title",
  "body": "Updated content",
  "userId": 1
}
```

**Expected Response:**
- Status: 200 OK
- Response contains the updated resource

#### PATCH Request
Used to partially update a resource.

**Example:**
```
Method: PATCH
URL: https://jsonplaceholder.typicode.com/posts/1
Headers:
  Content-Type: application/json
Body:
{
  "title": "Partially Updated Title"
}
```

**Expected Response:**
- Status: 200 OK
- Response contains the resource with updated fields

#### DELETE Request
Used to remove a resource.

**Example:**
```
Method: DELETE
URL: https://jsonplaceholder.typicode.com/posts/1
```

**Expected Response:**
- Status: 200 OK or 204 No Content
- Empty or confirmation response body

### 📊 Response Features

When you send any request, you'll see:
- **Status Code**: HTTP status (200, 201, 404, 500, etc.)
- **Response Time**: Duration in milliseconds
- **Response Size**: Size in KB
- **Response Headers**: All returned headers
- **Response Body**: Pretty-printed JSON or raw data

### ⚠️ Error Handling

The application handles:
- Network errors
- Timeout errors (30-second limit)
- Invalid URLs
- Server errors (4xx, 5xx status codes)
- All errors are captured and displayed with details

### 💾 Request History

- All executed requests are automatically saved
- View request history with timestamps
- Response data is stored for quick reference
- Each run includes status, timing, and full response

---

## 📁 Project Structure

```
api-pilot/
├── prisma/                      # Database schema and migrations
│   ├── schema.prisma           # Prisma schema definition
│   ├── migrations/             # Database migrations
│   └── generated/              # Generated Prisma types
│
├── public/                      # Static assets
│   └── ApiPilot.gif           # Application logo
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── sign-in/       # Sign-in page
│   │   │   └── layout.tsx     # Auth layout
│   │   │
│   │   ├── (workspace)/       # Workspace routes
│   │   │   ├── page.tsx       # Main workspace page
│   │   │   ├── layout.tsx     # Workspace layout
│   │   │   ├── workspace-context.tsx  # Workspace context
│   │   │   └── workspace-initializer.tsx
│   │   │
│   │   ├── invite/            # Invite acceptance
│   │   │   └── [token]/       # Dynamic invite token route
│   │   │
│   │   ├── api/               # API routes
│   │   │   └── auth/          # Auth endpoints
│   │   │
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   │
│   ├── components/            # Shared components
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── ...
│   │   │
│   │   ├── theme-provider.tsx
│   │   ├── query-provider.tsx
│   │   └── hot-key-provider.tsx
│   │
│   ├── modules/              # Feature modules
│   │   ├── authentication/   # Auth module
│   │   │   ├── actions/     # Server actions
│   │   │   ├── components/  # Auth components
│   │   │   └── types/       # Type definitions
│   │   │
│   │   ├── workspace/        # Workspace module
│   │   │   ├── actions/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   │
│   │   ├── collections/      # Collections module
│   │   │   ├── actions/
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   │
│   │   ├── request/          # Request module
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── store/
│   │   │
│   │   ├── invites/          # Invites module
│   │   │   ├── actions/
│   │   │   └── hooks/
│   │   │
│   │   └── layout/           # Layout module
│   │       ├── components/  # Header, Workspace selector, etc.
│   │       ├── store/       # Layout state
│   │       └── types/
│   │
│   └── lib/                  # Utility libraries
│       ├── auth.ts          # Auth configuration
│       ├── auth-client.ts   # Auth client
│       ├── db.ts            # Database client
│       └── utils.ts         # Utility functions
│
├── .env                      # Environment variables
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── docker-compose.yml       # Docker Compose configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind configuration
└── README.md                # This file
```

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   React UI   │  │    Zustand   │  │  React Query │          │
│  │  Components  │  │     Store    │  │    Cache     │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                  │
└─────────┼─────────────────┼──────────────────┼──────────────────┘
          │                 │                  │
          └─────────────────┴──────────────────┘
                            │
                   ┌────────▼────────┐
                   │   Next.js App   │
                   │  (App Router)   │
                   └────────┬────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
    ┌──────▼──────┐  ┌──────▼──────┐ ┌──────▼──────┐
    │   Server    │  │  API Routes │ │   Server    │
    │   Actions   │  │  (Handlers) │ │  Components │
    └──────┬──────┘  └──────┬──────┘ └──────┬──────┘
           │                │                │
           └────────────────┼────────────────┘
                            │
                   ┌────────▼────────┐
                   │  Prisma Client  │
                   │   (Type-safe)   │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │   PostgreSQL    │
                   │    Database     │
                   └─────────────────┘
```

### Data Flow

1. **User Interaction** → Component triggers action
2. **Client-side State** → Zustand or React Query manages state
3. **Server Action** → Next.js server action called
4. **Database Operation** → Prisma executes query
5. **Response** → Data flows back through the stack
6. **UI Update** → Components re-render with new data

### Authentication Flow

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  User    │────▶│  Sign-in    │────▶│  Better Auth │────▶│  OAuth     │
│  Click   │     │  Button     │     │  Handler     │     │  Provider  │
└──────────┘     └─────────────┘     └──────┬───────┘     └────────────┘
                                             │
                                             ▼
                                      ┌──────────────┐
                                      │  Create      │
                                      │  Session     │
                                      └──────┬───────┘
                                             │
                                             ▼
                                      ┌──────────────┐
                                      │  Redirect to │
                                      │  Workspace   │
                                      └──────────────┘
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `BETTER_AUTH_SECRET` | Secret key for auth | Yes | - |
| `BETTER_AUTH_URL` | Application URL | Yes | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | No | - |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | No | - |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | No | - |

### OAuth Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### GitHub OAuth
1. Go to GitHub [Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev      # Create new migration
npx prisma migrate deploy   # Apply migrations in production
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema changes without migration

# Docker
docker-compose up -d        # Start PostgreSQL
docker-compose down         # Stop PostgreSQL
docker-compose logs -f      # View logs
```

### Coding Standards

- **TypeScript**: All code must be typed
- **Components**: Use functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **Imports**: Organize imports logically (React, Next.js, libs, components, types)
- **Comments**: Write clear, concise comments for complex logic
- **Commits**: Follow conventional commit format

### Keyboard Shortcuts (Development)

All keyboard shortcuts are designed to NOT conflict with browser shortcuts:
- `Ctrl/Cmd + K`: Search/Command palette
- `Ctrl/Cmd + S`: Save request
- `Ctrl/Cmd + Shift + N`: New request
- `Ctrl/Cmd + Shift + E`: Edit collection
- `Ctrl/Cmd + ?`: Show shortcuts

---

## 🚢 Deployment

### Build for Production

```bash
# Install dependencies
npm ci

# Build application
npm run build

# Start production server
npm run start
```

### Docker Deployment

```bash
# Build image
docker build -t api-pilot .

# Run container
docker run -p 3000:3000 --env-file .env api-pilot
```

### Environment Setup

Ensure all environment variables are set in your deployment platform:
- Vercel: Project Settings → Environment Variables
- AWS/GCP: Update environment config
- Docker: Use `.env` file or pass via `-e` flag

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass before submitting

### Bug Reports
Use the GitHub Issues tab to report bugs. Include:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with love using:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Better Auth](https://www.better-auth.com/)
- [TailwindCSS](https://tailwindcss.com/)

---

## 📞 Support

- 📧 Email: support@apipilot.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/api-pilot/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/api-pilot/discussions)

---

<div align="center">
  <strong>Made with ❤️ by developers, for developers</strong>
  <br/>
  <sub>Star ⭐ this repo if you find it helpful!</sub>
</div>
