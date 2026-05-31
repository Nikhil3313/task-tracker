FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY openapi.yaml ./openapi.yaml

EXPOSE 5000

CMD ["npm", "start"]
