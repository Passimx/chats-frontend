# Passimx Chats Frontend

> A modern open-source frontend client for anonymous communication — no registration, no personal data, no phone numbers.  

> Designed for privacy-first chat systems that anyone can self-host.

## Features

---

- 🔒 Messaging **without authentication** or any personal identifiers
- 🌐 **Self-hostable** — deploy your own secure server
- 💬 Supports both private and group chats
- 📱 Responsive design (SPA / PWA ready)
- ⚙️ Simple integration with the backend API

---

## Technologies

---

| Area        | Technologies Used                      |
|--------------|----------------------------------------|
| API          | Fetch / WebSocket / XHR                |
| Encryption   | RSA-OAEP SHA-512 / AES-GCM SHA-256     |
| Caching      | Cache Storage / IndexedDB / LocalStorage |

## Project Structure

---
```
chats-frontend/
│
├── .github/              # Конфигурация для CI/CD
├── .husky/               # Git хуки
├── nginx/                # Настройка nginx для Докер образа
├── public/               # Статические файлы (словарь, иконки, манифест файл для pwa, воркеры)
├── src/
│   ├── common/           # Кастомные React-хуки, функции и сервисы
│   ├── components/       # Компоненты    
│   ├── modules/          # Модули
│   ├── pages/            # Главные страницы 
│   ├── root/
│   │   │
│   │   ├── api/          # Все API находится в папке api
│   │   │   │
│   │   │   ├── chats/    # Эндпоинты для чатов
│   │   │   ├── files/    # Эндпоинты для файлов
│   │   │   ├── messages/ # Эндпоинты для сообщений
│   │   │   └── index.ts  # Конфигурация API-клиента
│   │   │
│   │   ├── contexts      # Компоненты, влияющие на все приложение
│   │   ├── routes        # Навигация приложения относительно url
│   │   ├── store         # Глобальное состояние (Redux)
│   │   ├── types         # Общие типы TypeScript
│   │   └── wrappers      # Компоненты, влияющие на все приложение
│   │
│   ├── app.tsx           # Главный компонент приложения
│   ├── index.css         # Общие стили для приложения
│   └── main.tsx          # Точка входа
│
├── .env.example          # Пример конфигурации переменных окружения
├── .eslintrc.cjs         # Анализатор кода кода 
├── .gitignore            # Ограничения для git
├── .prettierrc           # Форматирование кода 
├── Dockerfile            # Докер образ
├── index.html            # Главная страница веб-сайта
├── LICENSE               # Лицензия
├── package.json          # Файл сборки проекта
├── package-lock.json     # Файл установки пакетов
├── README.md             # Файл информации о проектке
├── tsconfig.json         # Типизация
├── tsconfig.node.json    # Типизация
└── vite.config.ts        # Конфигурация VITE
```
---
## Getting Started

---

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