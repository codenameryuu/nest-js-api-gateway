FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install

# npm run start:dev
CMD ["npm", "run", "start:dev"]

