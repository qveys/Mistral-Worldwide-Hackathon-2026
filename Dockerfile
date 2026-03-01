FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json* ./
RUN npm ci || npm install

COPY . .

ARG APP=frontend
ARG PORT=3000
EXPOSE $PORT

CMD npm run dev -w $APP
