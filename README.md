# Pomodoro Rebuy Demo

To use this application please have [docker-compose](https://docs.docker.com/compose/install/) installed in good working order.

You will also need `Node 21.7.1`, which can be installed via [nvm](https://nodejs.org/en/download/package-manager) or whatever node version manager you prefer.


To run the [frontend](./frontend/README.md) independently of docker-compose please refer to that documentation file located within its folder.

Similarly to run the [backend](./api/README.md) independently of docker-compose please refer to that documentation located within its folder.

## Running full stack via docker-compose

### development mode

please use this to run the application at this time

```bash
docker-compose up -d
```

### production mode

This will pull containers from docker hub and run application in appropriate version based on `.env` value. If running in production mode, please ensure this value is defined or this will not work.

At this time the demo should be run in this mode.

```bash
docker-compose -f docker-compose-prod.yml up -d
```

when running in either mode frontend application will be available by default at:

```
http://localhost:5173
```

If `.env` values have been updated, please adjust that accordingly

## View Logs

### development mode
```bash
docker-compose logs
```

### production mode
```bash
docker-compose -f docker-compose-prod.yml logs 
```

add the `-f` flag at the end to follow all log updates from either, i.e.:

```bash
docker-compose -f docker-compose-prod.yml logs -f
```

## Stop the application

### development mode
```bash
docker-compose down
```

### production mode
```bash
docker-compose -f docker-compose-prod.yml down 
```

## Delete the application, as well as database data from local environment

### development mode
```bash
docker-compose down -v
```

### production mode
```bash
docker-compose -f docker-compose-prod.yml down -v
```

## Build or rebuild containers

this should be used after a new node_module is installed as the container will not have that value.

It is also important that because the containers are named the same if you are running in one mode, you need to rebuild into the other mode.

i.e. if you have been running the development build in order to properly view your changes in production mode you will need to build and push

if you have been running in production mode, you will need to build development to ensure you are using containers running the development scripts.

This could be circumvented by naming the containers different names, but I'm undecided if that is the correct path forward.

### development mode
```bash
docker-compose build
```

### production mode
```bash
docker-compose -f docker-compose-prod.yml build
```
## Push containers to docker hub

this should be used after a new node_module is installed as the container will not have that value

### development mode
```bash
docker-compose push
```

### production mode
```bash
docker-compose -f docker-compose-prod.yml push 
```

## Running just the database(prod or dev) -- still recommended if you are running the applications directly on machine

### development mode
```bash
docker-compose postgres up -d
```

### production mode
```bash
docker-compose -f docker-compose-prod.yml up postgres  -d
```

## Application Decisions


### Backend

I chose to use `Express`, `Postgres`, and `React(vite)` for ease of setup. `Express` is a bit of an aging choice, as it doesn't have direct support for async routes. Using the library `express-async-handler` you can get around that, but adding libraries for this purpose may not be the correct decision in an enterprise app created in 2024. One major reason to use it is compatibility of libraries.

The `express` server is primarily CRUD actions, and a simple auth endpoint. I used Bcrypt to hash the password, and I'm kind of torn on this decision. I like Bcrypt but I think I might make the choice to go with Argon2 in a different circumstance to ensure better hashing algorithms and overall better security. I used BCrypt because I know it, and could set it up quickly.

On that note, I chose not to setup a logging library for development speed, in production I'd probably opt for `pino`, and use `pino-pretty` for development. Its a great library, but I didn't think it was necessary for this exercise. 

One major thing that I think is necessary for most applications is a top level error handler, which can be found [here](./api/src/middleware/errorHandler.middleware.ts). This allows the actual route handlers to stay minimal and only include the logic required to complete that task. Any thrown error can be picked up by the handler, from any function in the stack, or it returns a generic `application-error` if something is uncaught. This protects the application from crashes, and ensures that logging is correctly sent to an aggregator. In some cases you'd want your application to crash, if certain types of errors are received from the handler you can exit the process from there. Similarly you can add a request/response logger setup in a similar fashion.

### Frontend

Using react is an easy choice. My goto for the last couple of years has been NextJS, but a Vite application is still a robust and good choice. It's quick, the hot module reloading makes development easy and quick. On top of that I chose to use TanStack Query v5(fetching library) and Zustand(global state management). Zustand isn't as robust as something like Redux or RTK(Redux Toolkit), but for small project development it is much simpler, and offers plenty of functionality. Redux can be overkill for many projects, and staying with a tool better suited for the job makes sense here.

On the frontend other notable libraries are: React-Router(for page routing) and Axios(fetching). These were picked for familiarity and ease of use.

I've tried to ensure that the application is only using necessary libraries to achieve what I wanted, for example, I used plain CSS modules almost entirely across the board. In a production app I may choose to use a UI library depending on the project, but I didn't feel that was necessary here.

You might be thinking, "well why did you use TanStack Query then?". I subscribe to the concept that each frontend application has 4 kinds of state:

- Local state
  - should only be on a page or component and not shared
- Global state
  - should be accessible from almost anywhere in the app without passing a prop down
- Server State
  - what is retrieved from the server, and ultimately is server data
  - the server should own the data, and if that data is cached on the frontend it can cause issues if improperly managed
- Prop State
  - should be used in limited ways to ensure each component can stand on its own
  - passing ids down makes sense, but passing entire data objects can lead to prop drilling, while not the end of the world should be avoided where possible.

### Fullstack

On both the frontend and backend I opted for Typescript and Zod for validation. The frontend validation in this case isn't as robust as the backend, as data security can really only be controlled on an environment you own. Any dev knows that you do not own the frontend, and presents security holes if you rely only on frontend validation.

In production I'd probably opt to have a shared `Types` folder to make type management a bit easier in this `monorepo`. If using a framework like `NextJS` `Remix` types would be available in both contexts, but aren't here.

### Database

With the postgres database access I opted to avoid an ORM, as I generally find it easier to directly query postgres and it provides more robust options with a simple query wrapper. It cuts down on overhead. Instead of migrations I've included a top level [sql](./sql/) folder that is read when the `docker-compose` command is run. This will setup the database to desired start state. 





