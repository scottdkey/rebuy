# Pomodoro Rebuy Demo

To use this application please have [docker-compose](https://docs.docker.com/compose/install/) installed in good working order.

You will also need `Node 21.7.1`, which can be installed via [nvm](https://nodejs.org/en/download/package-manager) or whatever node version manager you prefer.


To run the [frontend](./frontend/README.md) please refer to that documentation file located within its folder.

Similarly to run the [backend](./api/README.md) please refer to that documentation located within its folder.

## Running the database

The database is a `PostgreSQL` database setup with `docker-compose`. To fully setup the database please run the command:

```bash
docker-compose up -d
```

This will spin up the database and migrate everything for development mode. 

To stop the database please run

```bash
docker-compose down
```

To delete the database volume and remove all containers please run

```bash
docker-compose down -v
```