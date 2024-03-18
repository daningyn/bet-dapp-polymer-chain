FROM node:18-alpine
WORKDIR /app
COPY package.json ./
COPY ./ ./
RUN npm i
RUN npm i nodemon -g
CMD ["npm", "run", "dev"]