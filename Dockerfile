FROM node:24-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@11 && pnpm config set store-dir /pnpm-store

FROM base AS dev
EXPOSE 5173
CMD ["sh", "-c", "pnpm install && pnpm dev --host 0.0.0.0"]

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
