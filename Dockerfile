FROM node:20-alpine
WORKDIR /app

# Copy package manifests first to maximize dependency-layer cache hits.
COPY package.json package-lock.json ./
RUN mkdir -p app/frontend app/backend
COPY app/frontend/package.json app/frontend/package-lock.json ./app/frontend/
COPY app/backend/package.json app/backend/package-lock.json ./app/backend/

RUN npm ci

COPY . .
ARG APP=frontend
ARG PORT=3000
ENV APP=${APP}
ENV PORT=${PORT}
EXPOSE $PORT
CMD npm run dev -w $APP
