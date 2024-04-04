import express from "express"
import userRouter from "./user/user.router.js"
import cookieParser from 'cookie-parser';
import pomodoroRouter from "./pomodoro/pomodoro.router.js"
import tasksRouter from "./tasks/tasks.router.js"
import authRouter from "./auth/auth.router.js"
import cors from "cors";

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



const routers = [
  { path: "/user", router: userRouter },
  { path: "/pomodoro", router: pomodoroRouter },
  { path: "/tasks", router: tasksRouter },
  { path: "/auth", router: authRouter },
]

routers.forEach(({ path, router }) => {
  console.debug(`register router ${path}`)
  app.use(path, router)
})

app.on('error', (e) => {
  console.error("uncaught exception", e)
})
try {
  app.listen(port, () => {
    console.log(`listening on localhost:${port}`)
  })
} catch (e) {
  console.error(e, 'application uncaught exception')
}