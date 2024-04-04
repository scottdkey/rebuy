import { Router } from "express";
import { z } from "zod";
import { getUser } from "../user/user.repository.js";
import { comparePassword } from "../util/password.util.js";
import { config } from "../config.js";
import { signJWT } from "../util/jwt.util.js";
import { requireAuth } from "../middleware/requireAuth.middleware.js";



const authRouter = Router()

authRouter.post('/signin', async (req, res) => {
  try {
    const body = z.object({
      username: z.string(),
      password: z.string()
    }).parse(req.body)
    //this is being done in here instead of a service due to the fact that I need to directly modify request and response objects
    // in a production app this logic may be moved to a service to make this a bit cleaner
    const user = await getUser({ username: body.username })
    if (user) {
      const validPassword = await comparePassword(body.password, user?.password)
      if (validPassword === false) throw { message: { message: "invalid password" }, status: 403 }
      const signedJwt = signJWT({ id: user?.id, username: user?.username })
      res.cookie(config.cookieName, signedJwt, config.cookieOptions)

      res.send({ message: "sign in" })
    }
  } catch (e) {
    console.error(e, 'signin error')
    res.send(e.message).status(e.status || 500)
  }
})

authRouter.get('/signout', requireAuth, async (req, res) => {
  try {
    if (req.user) {
      // will clear cookie and render session invalid
      // for a more robust system a sessionId would be stored in either an in memory cache(eg redis), or in a database to be able to control sessions
      res.clearCookie(config.cookieName)
      res.send({ message: "signed out" }).end()
    } else {
      res.send({ message: 'something went wrong, no user detected, but passed auth checks' }).status(500)
    }
  } catch (e) {
    console.error(e, 'sign out error')
    res.send(e.message).status(e.status || 500)
  }
})



export default authRouter