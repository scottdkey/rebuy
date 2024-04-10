# Stage 1: Build the app
FROM node:21 AS build
WORKDIR /app/api
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Development
FROM build AS development
ENV NODE_ENV=development
WORKDIR /app/api
CMD ["npm", "run", "dev"]

# # Stage 3: Production
FROM node:21-alpine AS production
ENV NODE_ENV=production
WORKDIR /app/api
COPY package.json  .
COPY package-lock.json .
RUN npm install --only=production
COPY --from=build /app/api/dist ./dist

CMD ["npm" , "run", "start"]
