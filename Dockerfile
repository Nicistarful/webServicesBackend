FROM node:16
WORKDIR /urs/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY ./ ./
EXPOSE 80
CMD ["node", "server.js"]