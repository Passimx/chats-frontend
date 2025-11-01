![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-success)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen)
![Docker Automated build](https://img.shields.io/docker/automated/passimx/chats-frontend?label=docker)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/passimx/chats-frontend/github-actions.yml)

# PassimX Chats Frontend

> A modern open-source frontend client for anonymous communication — no registration, no personal data, no phone numbers.  

> Designed for privacy-first chat systems that anyone can self-host.

## Overview

PassimX is built to redefine privacy in online communication.  
Unlike traditional messengers, it doesn’t collect personal data or require phone/email verification — giving organizations and individuals full control over their communication.

# License

PassimX Chats Frontend is released under the terms of the MIT license.  
See https://opensource.org/license/MIT for more information.


## Features

- 🔒 Messaging **without authentication** or any personal identifiers
- 🌐 **Self-hostable** — deploy your own secure server
- 💬 Supports both private and group chats
- 📱 Responsive design (SPA / PWA ready)
- ⚙️ Simple integration with the backend API


## Technologies

| Area        | Technologies Used                      |
|--------------|----------------------------------------|
| API          | Fetch / WebSocket / XHR                |
| Encryption   | RSA-OAEP SHA-512 / AES-GCM SHA-256     |
| Caching      | Cache Storage / IndexedDB / LocalStorage |


## Project Structure

```
chats-frontend/
│
├── .github/              # CI/CD configuration
├── .husky/               # Git hooks
├── nginx/                # Nginx configuration for Docker build
├── public/               # Static files (dictionary, icons, manifest, workers)
├── src/
│   ├── common/           # Custom React hooks, utilities, and services
│   ├── components/       # UI components    
│   ├── modules/          # Application modules
│   ├── pages/            # Main app pages
│   ├── root/
│   │   │
│   │   ├── api/          # All backend API logic
│   │   │   │
│   │   │   ├── chats/    # Chat-related endpoints
│   │   │   ├── files/    # File management endpoints
│   │   │   ├── messages/ # Message endpoints
│   │   │   └── index.ts  # API client configuration
│   │   │
│   │   ├── contexts      # Global React contexts
│   │   ├── routes        # Application routing
│   │   ├── store         # Global state (Redux)
│   │   ├── types         # Shared TypeScript types
│   │   └── wrappers      # High-level wrappers affecting the whole app
│   │
│   ├── app.tsx           # Root application component
│   ├── index.css         # Global styles
│   └── main.tsx          # Entry point
│
├── .env.example          # Example environment configuration
├── .eslintrc.cjs         # ESLint configuration 
├── .gitignore            # Git ignore rules
├── .prettierrc           # Prettier code style config
├── Dockerfile            # Docker build definition
├── index.html            # Base HTML entry
├── LICENSE               # License file
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Locked dependency tree
├── README.md             # Project documentation
├── tsconfig.json         # TypeScript config
├── tsconfig.node.json    # TypeScript config for Node environment
└── vite.config.ts        # Vite build configuration
```


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

## Environment Variables

The project uses a `.env` file to configure backend endpoints.

| Variable | Description                          | Example                       |
|-----------|--------------------------------------|-------------------------------|
| `VITE_SALT` | Salt for generation crypto keys      | `eXaMpLe_SaLt`                |
| `VITE_CATCH_LOGS` | Show logs at app or not              | `true`                        |
| `VITE_CHATS_SERVICE_URL` | Chats service connection URL         | `https://api.passimx.chat`    |
| `VITE_FILES_SERVICE_URL` | Files service connection URL         | `http://localhost:6030/files` |
| `VITE_NOTIFICATIONS_SERVICE_URL` | Notifications service connection URL | `ws://localhost:7022`         |

## Backend Repositories

See the backend source here: 

[Chats Service Backend](https://github.com/Passimx/chats-service)

[Files Service Backend](https://github.com/Passimx/files-service)

[Notifications Service Backend](https://github.com/Passimx/notifications-service)

## Branch Structure

| Branch | Description | Stability |
|:-------|:-------------|:-----------|
| **`main`** | Development branch. Contains experimental and in-progress features — code here may be unstable. | ⚠️ Unstable |
| **`test`** | Pre-release branch. Used for integration testing and QA before going to production. | ⚠️ Semi-stable |
| **`relis`** | Production branch. Contains only tested and approved code. | ✅ Stable |


### Branch Workflow

1. **All new features and fixes** are developed in separate feature branches (e.g. `feature/chat-encryption`, `bugfix/message-scroll`).
2. When ready, they are merged into **`main`** for integration.
3. Periodically, `main` is merged into **`test`** for pre-release testing.
4. Once verified, `test` is merged into **`relis`** for production deployment.

> 🔒 The `main`, `test` and `relis` branches are protected — direct pushes are not allowed.  
> All changes must go through a **Pull Request (PR)**.


# Contributing

We welcome contributions from the community!  
If you want to help improve **Passimx**, please follow these guidelines:

## How to Contribute

1. **Fork** this repository to your own GitHub account.
2. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them with clear messages:
   ```bash
   git add .
   git commit -m "feature: chat encryption module"
   ```
4. Push your branch and open a Pull Request to the `main` branch.

Thank You!

Every contribution — big or small — helps make Passimx Chats better for everyone.
Thank you for your time and effort