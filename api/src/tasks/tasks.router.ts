import { NextFunction, Request, Response, Router } from 'express'
import { z } from 'zod'


const tasksRouter = Router()

const createOrUpdateValidator = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email()
})

tasksRouter.get('/', (_: Request, res: Response, next: NextFunction) => {

  res.send("test")
  next()
})

tasksRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  const body = createOrUpdateValidator.parse(req.body)
  console.log(body)
  res.send('create user')
  next()
})


tasksRouter.put('/', (req: Request, res: Response, next: NextFunction) => {
  const body = createOrUpdateValidator.parse(req.body)
  console.log(body)
  res.send("update user")
  next()
})

export default tasksRouter