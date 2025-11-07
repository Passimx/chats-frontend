![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-success)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen)
![Docker Automated build](https://img.shields.io/docker/automated/passimx/chats-frontend?label=docker)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/passimx/chats-frontend/github-actions.yml)

# Passimx Chats Frontend

> A modern open-source frontend client for anonymous communication — no registration, no personal data, no phone numbers.

> Designed for privacy-first chat systems that anyone can self-host.

## Overview

Passimx is built to redefine privacy in online communication.  
Unlike traditional messengers, it doesn’t collect personal data or require phone/email verification — giving organizations and individuals full control over their communication.

# License

Passimx Chats Frontend is released under the terms of the MIT license.  
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
│   │   ├── api/                # All backend API logic
│   │   │   │
│   │   │   ├── chats/          # Chat-related endpoints
│   │   │   ├── files/          # File management endpoints
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
├── Dockerfile                  # Docker build definition
├── index.html                  # Base HTML entry
├── LICENSE                     # License file
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Locked dependency tree
├── README.md                   # Project documentation
├── tsconfig.json               # TypeScript config
├── tsconfig.node.json          # TypeScript config for Node environment
└── vite.config.ts              # Vite build configuration
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

| Variable | Description                          | Example                     |
|-----------|--------------------------------------|-----------------------------|
| `VITE_SALT` | Salt for generation crypto keys      | `eXaMpLe_SaLt`              |
| `VITE_CATCH_LOGS` | Show logs at app or not              | `true`                      |
| `VITE_CHATS_SERVICE_URL` | Chats service connection URL         | `http://localhost:80/chats` |
| `VITE_FILES_SERVICE_URL` | Files service connection URL         | `http://localhost:80/files` |
| `VITE_NOTIFICATIONS_SERVICE_URL` | Notifications service connection URL | `ws://localhost:80/ws`      |

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

1. **All new features and fixes** are developed in separate feature branches (e.g. `feature/chat-encryption`, `bugfix/message-scroll`)
2. When ready, they are merged into **`main`** for integration
3. Periodically, `main` is merged into **`test`** for pre-release testing
4. Once verified, `test` is merged into **`relis`** for production deployment

> 🔒 The `main`, `test` and `relis` branches are protected — direct pushes are not allowed.  
> All changes must go through a **Pull Request (PR)**.


# Verify Frontend Build Integrity

Every person can verify that the code deployed on the production server **matches exactly** what’s published on GitHub.

### What “Frontend Build Integrity” means

When you open a website, all the JavaScript, HTML, and CSS you get from the server could, in theory, be **modified** — either accidentally, by malware, or by a compromised server.
This verification step ensures that the files actually running in production are **bit-for-bit identical** to the trusted version built and signed by the developer.

### Why the GPG key matters

The ```GPG``` (GNU Privacy Guard) signature acts like a **digital seal**.
Only the developer who owns the private key can create a valid signature for ```dist.sha256``` (dist.sha256.asc).
If anyone tampers with the files or their hashes, the signature check will fail — letting you know the build was altered.

### Important
The files
```text
/dist.sha256
/dist.sha256.asc
```
**must always remain publicly accessible** on production site.
These files are essential for allowing anyone to verify the integrity and authenticity of the deployed build.

### How to run the verification
   ```bash
   npm run verify -- https://example.com
   ```

The script will:
1. Download the ```dist.sha256``` file from the server (list of file hashes);
2. Fetch all files listed there and compute their local SHA256 checksums;
3. Compare them against the server’s checksums;
4. Verify server ```dist.sha256.asc``` signature for computed dist.sha256 using GPG and the local ```public.key```

### Example of successful output
   ```text
   🔗 Using dist.sha256: https://example.com/dist.sha256
   🌍 Base URL: https://example.com
   ⬇️  Downloading dist.sha256...
   ...
   ✅ All computed hashes match server dist.sha256
   ✅ Signature verified.
   ```
### Requirements
- Node.js ≥ ***18.0*** (support native ```fetch```)
- ***GPG*** (for signature verification)


# Contributing

We welcome contributions!
Every contribution — big or small — helps make **Passimx** better for everyone.
Thank you for your time and effort.

### How to Contribute

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

