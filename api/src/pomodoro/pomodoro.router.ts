import { Router } from 'express'
import { z } from 'zod'
import { createPomodoro, deletePomodoro, getPomodoroById, getPomodoros, updatePomodoro } from './pomodoro.repository.js'
import { requireAuth } from '../middleware/requireAuth.middleware.js'


const pomodoroRouter = Router()

const createValidator = z.object({
  nickname: z.string(),
  timerTime: z.number(),
  shortBreakTime: z.number(),
  longBreakTime: z.number()
})

const updateValidator = z.object({
  id: z.string().uuid(),
  nickname: z.string(),
  timerTime: z.number(),
  shortBreakTime: z.number(),
  longBreakTime: z.number()
})

/**
 * get all users pomodoro
 */
pomodoroRouter.get('/', requireAuth, async (req, res) => {
  try {
    const user = req.user
    const response = await getPomodoros(user?.id)
    res.send(response)
  } catch (e) {
    console.error(e, 'get all pomodoro error')
    res.send(e.message || { message: "something went wrong" }).status(e.status || 500)
  }
})

/**
 * get pomodoro by id, restricted by user
 */
pomodoroRouter.get('/:id', requireAuth, async (req, res) => {
  try {
    const user = req.user
    const id = req.params.id
    const response = await getPomodoroById(id)
    if (response && user?.id !== response.userId) {
      throw { message: { message: "not authorized to access resource" }, status: 403 }
    }
    res.send(response)
  } catch (e) {
    console.error(e)
    res.send(e.message || { message: "something went wrong" }).status(e.status || 500)
  }
})


/**
 * create pomodoro
 */
pomodoroRouter.post('/', requireAuth, async (req, res) => {
  try {
    // user will always exist with the requireAuth Middleware, the error is handled from there as well
    const user = req.user
    if (user) {
      //validate inputs
      const body = createValidator.parse(req.body)
      const response = await createPomodoro({ userId: user.id, ...body })
      res.send(response)
    } else {
      throw { message: { message: "unable to find user, this is a protected resource" }, status: 403 }
    }


  } catch (e) {
    console.error(e)
    res.send(e.message || { message: "something went wrong" }).status(e.status || 500)
  }
})

/**
 * update pomodoro by id
 */
pomodoroRouter.patch('/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id
    const user = req.user
    //validate inputs
    const body = updateValidator.parse(req.body)
    const existing = await getPomodoroById(body.id)
    if (user === null) {
      throw { message: { message: "unable to find user, this is a protected resource" }, status: 403 }
    }
    if (existing.userId !== user?.id) {
      throw { message: { message: "user id of resource does not match current signed in user, this is a protected resource" }, status: 403 }

    }
    const response = await updatePomodoro({ ...body, id })
    console.log(response)
    res.send(response)
  } catch (e) {
    console.error(e)
    res.send(e.message || { message: "something went wrong" }).status(e.status || 500)
  }
})


/**
 * delete pomodoro
 */
pomodoroRouter.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id

    const response = await deletePomodoro(id)
    if (response === true) res.status(200).send(response)
    if (response === false) res.status(400).send(response)
  } catch (e) {
    console.error(e)
    res.send(e.message || { message: "something went wrong" }).status(e.status || 500)
  }
})

export default pomodoroRouter