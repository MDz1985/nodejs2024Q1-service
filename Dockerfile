FROM node:20.11.1-alpine

RUN npm install -g npm@latest

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ARG PORT=5000
ENV PORT ${PORT}
EXPOSE ${PORT}


RUN npx prisma generate

CMD ["npm", "run", "start:dev"]
