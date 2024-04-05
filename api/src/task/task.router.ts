import { Router } from 'express'
import { z } from 'zod'

import asyncHandler from "express-async-handler"
import { requireAuth } from '../middleware/requireAuth.middleware.js'
import { createTask, deleteTask, getTaskById, getTasksByUserId, updateTask } from './task.repository.js'
import { ProtectedResourceError } from '../errors.js'


const tasksRouter = Router()

const createValidator = z.object({
  taskName: z.string(),
  description: z.string()
})
const updateValidator = createValidator.extend({
  complete: z.boolean()
})

// get all tasks by userId
// we aren't using JSDoc style comments due to the fact that these functions aren't used anywhere else
tasksRouter.get('/', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  const user = req.user
  const response = await getTasksByUserId(user?.id)
  // will default to status 200
  res.send(response)
}))


//get task by id, restricted by user
tasksRouter.get('/:id', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  const user = req.user
  const id = req.params.id
  const response = await getTaskById(id)
  // ensure that only the user that created the value can access it
  if (response && user?.id !== response.userId) {
    throw ProtectedResourceError
  }
  res.send(response)
}))


// create task value
tasksRouter.post('/', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  // user will always exist with the requireAuth Middleware, the error is handled from there as well
  const user = req.user
  if (user) {
    //validate inputs
    const body = createValidator.parse(req.body)
    const response = await createTask(body, user.id)
    res.send(response)
  }
}))

//  update task value
tasksRouter.patch('/:id', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  const id = req.params.id
  const user = req.user
  //validate inputs
  const body = updateValidator.parse(req.body)
  const existing = await getTaskById(id)

  if (existing.userId !== user?.id) {
    throw ProtectedResourceError

  }
  const response = await updateTask(body, id)

  res.send(response)
}))


// delete task value
tasksRouter.delete('/:id', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  const user = req.user
  const id = req.params.id
  const existing = await getTaskById(id)

  if (user?.id !== existing.userId) {
    throw ProtectedResourceError
  }


  const response = await deleteTask(id)
  // if response is true send a 200, if false send a 400 bad request
  res.status(response ? 200 : 400).send(response)
}))

export default tasksRouter