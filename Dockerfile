# Stage 1: base
FROM node:20.11.1-alpine AS base
WORKDIR /app
RUN npm install -g npm@10.4.0

# Stage 2: dependencies
FROM base AS dependencies
WORKDIR /app
COPY ./package.json package-lock.json ./
RUN npm ci

# Stage 3: build + verify + sign
FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

ARG VITE_CHATS_SERVICE_URL
ARG VITE_FILES_SERVICE_URL
ARG VITE_NOTIFICATIONS_SERVICE_URL
ARG ENVIRONMENT
ARG GPG_PRIVATE_KEY
ARG GPG_PASSPHRASE

ENV VITE_CHATS_SERVICE_URL=${VITE_CHATS_SERVICE_URL}
ENV VITE_FILES_SERVICE_URL=${VITE_FILES_SERVICE_URL}
ENV VITE_NOTIFICATIONS_SERVICE_URL=${VITE_NOTIFICATIONS_SERVICE_URL}
ENV VITE_ENVIRONMENT=${ENVIRONMENT}

# Build project
RUN npm run build
RUN cd dist && find . -type f -not -name "*.map" -print0 | sort -z | xargs -0 sha256sum | sed 's|^\(.*\)\ \./|\1\ |' > dist.sha256

# Importing a GPG key and signing an artifact
RUN apk add --no-cache bash gcompat coreutils gnupg tar gzip
RUN cd dist && \
    echo "$GPG_PRIVATE_KEY" | gpg --batch --import && \
    gpg --batch --pinentry-mode loopback --passphrase "$GPG_PASSPHRASE" --armor --output dist.sha256.asc --detach-sign dist.sha256

# Clear dev dependecies
RUN npm config set ignore-scripts true
RUN npm prune --omit=dev

# Stage 4: final (nginx)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 2223
CMD ["nginx", "-g", "daemon off;"]