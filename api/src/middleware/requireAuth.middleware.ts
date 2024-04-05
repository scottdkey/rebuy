import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const requireAuth = async (req: Request, _: Response, next: NextFunction) => {
  const token = req.cookies[config.cookieName]

  if (token === undefined) {
    throw { message: "not authorized to access resource", status: 401 }
  }

  if (token) {
    const validated = jwt.verify(token, config.jwtKey) as JwtPayload

    req.user = { id: validated.id, username: validated.username }
  }
  await next()
}