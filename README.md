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

| Area       | Technologies Used                        |
|------------|------------------------------------------|
| API        | Fetch / WebSocket / XHR                  |
| Encryption | RSA-OAEP SHA-512 / AES-GCM SHA-256       |
| Caching    | Cache Storage / IndexedDB / LocalStorage |
| Calls      | WebRTC                                   |

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