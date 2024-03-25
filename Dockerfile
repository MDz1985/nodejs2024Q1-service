FROM node:20.11.1-alpine

RUN npm install -g npm@latest

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

# to show you, that the port used from env and it is not 5000
ARG PORT=5000
ENV PORT ${PORT}
EXPOSE ${PORT}


RUN npx prisma generate

CMD ["npm", "run", "start:dev"]
