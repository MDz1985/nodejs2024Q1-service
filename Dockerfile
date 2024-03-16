FROM node:20.11-alpine

WORKDIR /app

COPY package*.json ./

RUN ls

RUN npm i

COPY . .

ARG PORT=5000
ENV PORT ${PORT}
EXPOSE ${PORT}

#ENV NODE_ENV=development

#VOLUME ["/app/src", "/app/node_modules"]

CMD ["npm", "run", "start:dev"]
