[go back](../README.md)
# API

## Environment Variables

Please copy the `.env-example` and rename it to `.env`, if you decide to change any of the values either in that file, or in the `docker-compose` file at the top level, please ensure that all the values line up in both places.

Please run the all following commands from the `api` folder of this repository.

## Application

This application is expecting you to be running `Node 21.7.1`. 

To install the correct node version if using NVM

```bash
nvm install
```

```bash
nvm use
```

Ensure that dependencies are installed

```bash
npm i
```

To run in development mode please run both the typescript watch, and the application watch commands in separate terminals

```bash
npm run dev
npm run watch
```

To build the application

```bash
npm run build
```

To run the application in production mode(suggested for this demo)

```bash
npm run start
```