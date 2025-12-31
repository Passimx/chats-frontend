# Contributing

We welcome contributions!
Every contribution — big or small — helps make **Passimx** better for everyone.
Thank you for your time and effort.

### How to Contribute

1. **Fork** this repository to your own GitHub account.
2. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-public-key-name
   ```
3. Make your changes and commit them with clear messages:
   ```bash
   git add .
   git commit -m "feature: chat encryption module"
   ```
4. Push your branch and open a Pull Request to the `main` branch.

## Getting Started

### Run locally with Node.js

```bash

# Clone the repository
git clone https://github.com/Passimx/chats-frontend.git

# Enter the directory
cd chats-frontend

# Install dependencies
npm ci

# Create an environment file
cp .env.example .env
# he .env file, specify your API server URLs

# Start in development mode
npm run dev

# Build for production
npm run build
```

## Project Structure

```
chats-frontend/
│
├── .github/                    # CI/CD configuration
├── .husky/                     # Git hooks
├── nginx/                      # Nginx configuration for Docker build
├── public/                     # Static files (dictionary, icons, manifest, workers)
├── src/
│   │
│   ├── common/                 # Custom React hooks, utilities, and services
│   ├── components/             # UI components    
│   ├── modules/                # Application modules
│   ├── pages/                  # Main app pages
│   ├── root/
│   │   │
│   │   ├── api/                # All backend API logic (with encrypt / decrypt logic)
│   │   │   │
│   │   │   ├── calls/          # Calls endpoints
│   │   │   ├── chats/          # Chat-related endpoints
│   │   │   ├── files/          # File management endpoints
│   │   │   ├── keys/           # Keys endpoints
│   │   │   ├── messages/       # Message endpoints
│   │   │   ├── notifications/  # Notifications Service connection
│   │   │   └── index.ts        # API client configuration
│   │   │
│   │   ├── contexts            # Global React contexts
│   │   ├── routes              # Application routing
│   │   ├── store               # Global state (Redux)
│   │   ├── types               # Shared TypeScript types
│   │   └── wrappers            # High-level wrappers affecting the whole app
│   │
│   ├── app.tsx                 # Root application component
│   ├── index.css               # Global styles
│   └── main.tsx                # Entry point
│
├── verify/
│   │
│   ├── public.key              # Public GPG key
│   ├── verify.js               # Verification script
│
├── .env.example                # Example environment configuration
├── .eslintrc.cjs               # ESLint configuration 
├── .gitignore                  # Git ignore rules
├── .prettierrc                 # Prettier code style config
├── CONTRIBUTING.md             # Code of conduct information
├── Dockerfile                  # Docker build definition
├── index.html                  # Base HTML entry
├── LICENSE                     # License file
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Locked dependency tree
├── README.md                   # Project files roadmap
├── release.config.cjs          # Semantic release branch rules
├── tsconfig.json               # TypeScript config
├── tsconfig.node.json          # TypeScript config for Node environment
└── vite.config.ts              # Vite build configuration
```

## Environment Variables

The project uses a `.env` file to configure backend endpoints.

| Variable | Description                         | Example             |
|-----------|-------------------------------------|---------------------|
| `VITE_API_URL` | Salt for generation crypto keys     | `example.com`       |
| `VITE_ENVIRONMENT` | Api host or you can use next variables | `staging`           |
| `VITE_CHATS_SERVICE_URL` | Chats service URL         | `http://localhost:80` |
| `VITE_FILES_SERVICE_URL` | Files service URL         | `http://localhost:80` |
| `VITE_NOTIFICATIONS_SERVICE_URL` | Notifications service URL | `ws://localhost:80` |

## Backend Repositories

See the backend source here:

[Chats Service](https://github.com/Passimx/chats-service)

[Files Service](https://github.com/Passimx/files-service)

[Notifications Service](https://github.com/Passimx/notifications-service)

[Calls Service](https://github.com/Passimx/calls-service)

## Branch Structure

| Branch        | Description | Stability |
|:--------------|:-------------|:-----------|
| **`main`**    | Development branch. Contains experimental and in-progress features — code here may be unstable. | ⚠️ Unstable |
| **`release`** | Production branch. Contains only tested and approved code. | ✅ Stable |


### Branch Workflow

1. **All new features and fixes** are developed in separate feature branches (e.g. `feature/chat-encryption`, `bugfix/message-scroll`)
2. When ready, they are merged into **`main`** for integration
4. Once verified, `main` is merged into **`release`** for production deployment

> 🔒 The `main` and `release` branches are protected — direct pushes are not allowed.  
> All changes must go through a **Pull Request (PR)**.
