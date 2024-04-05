import { Router } from 'express'
import { z } from 'zod'

import asyncHandler from "express-async-handler"
import { requireAuth } from '../middleware/requireAuth.middleware.js'
import { createHistory, deleteHistory, getHistoryById, getHistoryByUserId, updateHistory } from './history.repository.js'


const historyRouter = Router()

const createValidator = z.object({
  taskName: z.string(),
  description: z.string()
})
const updateValidator = createValidator.extend({
  complete: z.boolean()
})

// get all history rows by userId
historyRouter.get('/', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  const user = req.user
  const response = await getHistoryByUserId(user?.id)
  // will default to status 200
  res.send(response)
}))


//get history by id, restricted by user
historyRouter.get('/:id', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  const user = req.user
  const id = req.params.id
  const response = await getHistoryById(id)
  // ensure that only the user that created the value can access it
  if (response && user?.id !== response.userId) {
    throw { message: "user id of resource does not match current signed in user, this is a protected resource", status: 403 }
  }
  res.send(response)
}))


// create history value
historyRouter.post('/', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  // user will always exist with the requireAuth Middleware, the error is handled from there as well
  const user = req.user
  if (user) {
    //validate inputs
    const body = createValidator.parse(req.body)
    const response = await createHistory(body, user.id)
    res.send(response)
  }
}))

//  update history value
historyRouter.patch('/:id', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  const id = req.params.id
  const user = req.user
  //validate inputs
  const body = updateValidator.parse(req.body)
  const existing = await getHistoryById(id)

  if (existing.userId !== user?.id) {
    throw { message: "user id of resource does not match current signed in user, this is a protected resource", status: 403 }

  }
  const response = await updateHistory(body, id)

  res.send(response)
}))


// delete history value
historyRouter.delete('/:id', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  const user = req.user
  const id = req.params.id
  const existing = await getHistoryById(id)

  if (user && existing && user?.id !== existing.userId) {
    throw { message: "user id of resource does not match current signed in user, this is a protected resource", status: 403 }
  }


  const response = await deleteHistory(id)
  // if response is true send a 200, if false send a 400 bad request
  res.status(response ? 200 : 400).send(response)
}))

export default historyRouter