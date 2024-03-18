FROM node:20.11-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ARG PORT=5000
ENV PORT ${PORT}
EXPOSE ${PORT}

#ENV NODE_ENV=development

#VOLUME ["/app/src", "/app/node_modules"]
RUN npx prisma generate
#RUN npx prisma migrate dev --name init

CMD ["npm", "run", "start:dev"]
#CMD ["npx", "prisma", "migrate", "dev", "--name", "init"]
