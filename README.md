# PassimX Chats Frontend

> A modern open-source frontend client for anonymous communication — no registration, no personal data, no phone numbers.  

> Designed for privacy-first chat systems that anyone can self-host.


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