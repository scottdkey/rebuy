import { Router } from 'express'
import { z } from 'zod'
import { createPomodoro, deletePomodoro, getPomodoroById, getPomodoros, updatePomodoro } from './pomodoro.repository.js'
import { requireAuth } from '../middleware/requireAuth.middleware.js'
import asyncHandler from "express-async-handler"


const pomodoroRouter = Router()


// the validators ensure that we only get the types of values we expect
const createValidator = z.object({
  nickname: z.string(),
  timerTime: z.number(),
  shortBreakTime: z.number(),
  longBreakTime: z.number()
})

const updateValidator = createValidator.extend({
  id: z.string().uuid()
})


// get all pomodoros by userId
pomodoroRouter.get('/', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  const user = req.user
  const response = await getPomodoros(user?.id)
  // will default to status 200
  res.send(response)
}))


//get pomodoro by id, restricted by user
pomodoroRouter.get('/:id', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  const user = req.user
  const id = req.params.id
  const response = await getPomodoroById(id)
  if (response && user?.id !== response.userId) {
    throw { message: "not authorized to access resource", status: 403 }
  }
  res.send(response)
}))


// create pomodoro value
// this requires auth to ensure that only known users can access this and other resources
pomodoroRouter.post('/', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  // user will always exist with the requireAuth Middleware, the error is handled from there as well
  const user = req.user
  if (user) {
    //validate inputs
    const body = createValidator.parse(req.body)
    const response = await createPomodoro({ userId: user.id, ...body })
    res.send(response)
  }
}))

//  update pomodoro value
pomodoroRouter.patch('/:id', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  const id = req.params.id
  const user = req.user
  //validate inputs
  const body = updateValidator.parse(req.body)
  const existing = await getPomodoroById(body.id)

  if (existing.userId !== user?.id) {
    throw { message: "user id of resource does not match current signed in user, this is a protected resource", status: 403 }

  }
  const response = await updatePomodoro({ ...body, id })
  console.log(response)
  res.send(response)
}))


// delete pomodoro value
pomodoroRouter.delete('/:id', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  const id = req.params.id

  const response = await deletePomodoro(id)
  // if response is true send a 200, if false send a 400 bad request
  res.status(response ? 200 : 400).send(response)
}))

export default pomodoroRouter