# Stage 1: Build the app
FROM node:21 AS build
WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Development
FROM build AS development
ENV NODE_ENV=development
WORKDIR /app
RUN npm install --only=development
CMD ["npm", "run", "dev"]


# this is incomplete for the purposes of this demo as this needs to be an nginx setup to serve the static files
# # Stage 3: Production
FROM node:21 AS production
# ENV NODE_ENV=production
WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# RUN npm install --only=production

# COPY --from=build /app/dist ./dist
CMD ["npm", "run", "preview"]
