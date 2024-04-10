import { Router } from "express";


const healthRouter = Router()

healthRouter.get('/', (_, res) => {
  res.send({ healthy: true })
})

export default healthRouter