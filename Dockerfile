# Сайт STEPLINE: Next.js standalone-сервер (~150 МБ образ вместо node_modules целиком).
#   docker build -t stepline-site --build-arg NEXT_PUBLIC_SITE_URL=https://stepline.kz .
#   docker run -p 3000:3000 -e CRM_API_URL=http://api:8000 -e REVALIDATE_SECRET=... stepline-site
# NEXT_PUBLIC_* вшиваются при сборке (build-arg), CRM_API_URL/REVALIDATE_SECRET — при запуске (-e).

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_NOINDEX
ARG NEXT_PUBLIC_WEB3FORMS_KEY
ARG NEXT_PUBLIC_YM_ID
ARG NEXT_PUBLIC_GA_ID
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
CMD ["node", "server.js"]
