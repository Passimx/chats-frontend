# Stage 1: image
FROM node:20.11-alpine as base
WORKDIR /app
RUN npm install -g npm@10.4.0

# Stage 2: download dependencies
FROM base as dependencies
WORKDIR /app
COPY ./package.json package-lock.json ./
RUN npm ci

# Stage 3: build + delete dev dependencies
FROM base as build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
ARG VITE_CHATS_SERVICE_URL
ARG VITE_NOTIFICATIONS_SERVICE_URL
ENV VITE_CHATS_SERVICE_URL=${VITE_CHATS_SERVICE_URL}
ENV VITE_NOTIFICATIONS_SERVICE_URL=${VITE_NOTIFICATIONS_SERVICE_URL}
RUN npm run build
RUN npm config set ignore-scripts true
RUN npm prune --omit=dev

# Stage 4: final
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 2223
CMD ["nginx", "-g", "daemon off;"]
