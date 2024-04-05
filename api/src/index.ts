import cookieParser from 'cookie-parser';
import cors from "cors";
import express from "express";
import { ErrorHandler } from "./middleware/errorHandler.middleware.js";
import { routers } from "./routers.js";

const app = express()
const port = 3000
//use cookie middleware
app.use(cookieParser())
// use cors
// when accessing the frontend please ensure that you are using localhost and not 127.0.0.1
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


//parse body as json
app.use(express.json())


//programmatically add routers
routers.forEach(({ path, router }) => {
  console.debug(`register router ${path}`)
  app.use(path, router)
})

// top level error handler, to use this properly express-async-handler must be used
// this must be added after the routers to be effective
// if you wanted a request logger, it should be added before the routers
app.use(ErrorHandler)

try {
  app.listen(port, () => {
    console.log(`listening on localhost:${port}`)
  })
} catch (e) {
  console.error(e, 'application uncaught exception')
}