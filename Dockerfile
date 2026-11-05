FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.js ./
COPY index.html ./public/index.html
ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["npm","start"]
