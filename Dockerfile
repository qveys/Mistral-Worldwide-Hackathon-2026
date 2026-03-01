FROM node:20-alpine
WORKDIR /app
COPY package*.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install
COPY . .
RUN npm install
ARG APP=frontend
ARG PORT=3000
EXPOSE $PORT
CMD npm run dev -w $APP
