[go back](../README.md)
# Frontend Pomodoro

## Environment Variables

Please copy the [`.env-example`](./.env-example) and rename it to `.env`, if you decide to change any of the values either in that file, or in the `docker-compose` file at the top level, please ensure that all the values line up in both places.

## Application

To run this application please ensure that dependencies are installed.
This readme expects you to be running these commands from the `frontend` folder

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

To run the application in development mode(preferred for this demo)

```bash
npm run dev
```

To build the application for production

```bash
npm run build
```

To preview the application for production(do not use at this time, the backend is not setup to properly receive CORS requests for running in this mode)

```bash
npm run preview
```