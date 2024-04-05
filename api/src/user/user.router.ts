import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/requireAuth.middleware.js'
import { createUser, updateUser } from './user.service.js'
import { signJWT } from '../util/jwt.util.js'
import { config } from '../config.js'
import { getUser } from './user.repository.js'
import asyncHandler from "express-async-handler"

const userRouter = Router()


const createUserValidator = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email()
})
const updateUserValidator = z.object({
  // allow for partial updates
  // password and existing password must be sent together
  password: z.string().optional(),
  existingPassword: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional()
})

//get current user, due to require auth if a user is present, we can pull that id out and get the correct information
// the JWT validation should ensure that we never pass information to a bad actor
// in terms of security this can be beefed up, but has not been in this exercise
// the async handlers are on every middelware to ensure that the top level error handler can catch everything
userRouter.get('/', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  //user from jwt
  const user = req.user

  //since auth is required on this function, this will always be populated, but due to typing the check is still required
  // the require auth middleware is validating the JWT in the cookie, so this function doesn't need to.
  if (user) {
    //may have slightly different values than the cookie, to combat that pull from database
    const currentUser = await getUser({ id: user.id })

    res.send({ id: currentUser?.id, username: currentUser?.username })
  }

}))

//create new user, this does not require auth
// it is still wrapped in the asyncHandler to ensure errors are caught
userRouter.post('/', asyncHandler(async (req, res) => {
  const body: ICreateUser = createUserValidator.parse(req.body)
  const createdUser = await createUser(body)
  const scrubbedUser: JwtPayload = { id: createdUser.id, username: createdUser.username }
  const signedJwt = signJWT(scrubbedUser)
  res.cookie(config.cookieName, signedJwt, config.cookieOptions)
  res.send(scrubbedUser).status(201)
}))


/// update current user
// this is unused at this time, but provides an example of how a username or password might be updated
userRouter.patch('/', asyncHandler(requireAuth), asyncHandler(async (req, res) => {
  const body: IUpdateUser = updateUserValidator.parse(req.body)
  if (req.user) {
    const updatedUser = await updateUser(body, req.user.id)
    const scrubbedUser: JwtPayload = { id: updatedUser.id, username: updatedUser.username }
    const signedJwt = signJWT(scrubbedUser)
    res.cookie(config.cookieName, signedJwt, config.cookieOptions)
    res.send(scrubbedUser)
  } else {
    throw { message: "unable to find user", status: 404 }
  }
}))

export default userRouter