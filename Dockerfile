FROM node:24-alpine

WORKDIR /app


COPY package.json tsconfig.json ./
RUN npm install

COPY src ./src
COPY public ./public
COPY data ./data

CMD ["npm", "run", "serve"]
