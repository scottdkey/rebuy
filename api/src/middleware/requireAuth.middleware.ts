import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies[config.cookieName]

    if (token === undefined) {
      throw { message: { message: "not authorized to access resource" }, status: 401 }
    }

    if (token) {
      const validated = jwt.verify(token, config.jwtKey) as JwtPayload

      req.user = { id: validated.id, username: validated.username }
    }
  } catch (e) {
    console.error(e, 'requireAuth middleware error')
    res.send(e.message || { message: "something went wrong" }).status(e.status || 500).end()
  }
  await next()

}