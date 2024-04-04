import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/requireAuth.middleware.js'
import { validateAndCreateUser, validateAndUpdateUser } from './user.service.js'
import { signJWT } from '../util/jwt.util.js'
import { config } from '../config.js'
import { getUser } from './user.repository.js'

const userRouter = Router()


const createUserValidator = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email()
})
const updateUserValidator = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  existingPassword: z.string().optional()
})

/**
 * get current user
 */
userRouter.get('/', requireAuth, async (req, res) => {
  try {
    //user from jwt
    const user = req.user

    //since auth is required on this function, this will always be populated, but due to typing the check is still required
    // the require auth middleware is validating the JWT in the cookie, so this function doesn't need to.
    if (user) {
      //may have slightly different values than the cookie, to combat that pull from database
      const currentUser = await getUser({ id: user.id })

      res.send({ id: currentUser?.id, username: currentUser?.username })
    }
  } catch (e) {
    console.error(e, 'get user error')
    res.status(e.status || 500).send({ message: e.message || "something went wrong" })
  }
})

/**
 * create new user
 */
userRouter.post('/', async (req, res) => {
  try {
    const body: ICreateUser = createUserValidator.parse(req.body)
    const createdUser = await validateAndCreateUser(body)
    const scrubbedUser: JwtPayload = { id: createdUser.id, username: createdUser.username }
    const signedJwt = signJWT(scrubbedUser)
    res.cookie(config.cookieName, signedJwt, config.cookieOptions)
    res.send(scrubbedUser).status(201)

  } catch (e) {
    console.error(e, 'create user error')
    res.status(e.status || 500).send({ message: e.message })
  }
})


/**
 * update current user
 */
userRouter.put('/', requireAuth, async (req, res) => {
  try {
    const body: IUpdateUser = updateUserValidator.parse(req.body)
    if (req.user) {
      const updatedUser = await validateAndUpdateUser(body, req.user.id)
      const scrubbedUser: JwtPayload = { id: updatedUser.id, username: updatedUser.username }
      const signedJwt = signJWT(scrubbedUser)
      res.cookie(config.cookieName, signedJwt, config.cookieOptions)
      res.send(scrubbedUser)
    } else {
      throw { message: { message: "unable to find user" }, status: 404 }
    }

  } catch (e) {
    console.log(e, 'update user error')
    res.status(e.status || 500).send({ message: e.message })
  }
})

export default userRouter