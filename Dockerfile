FROM node:alpine as ts-compiler
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=ts-compiler /app/dist ./dist
EXPOSE 8080
CMD ["npm", "start"]