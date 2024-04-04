import jwt from "jsonwebtoken"
import { config } from "../config.js";



//user id and username
export function signJWT(payload: JwtPayload) {
  const key = config.jwtKey
  if (key === undefined) throw new Error('unable to find key in config')
  return jwt.sign(payload, key, { expiresIn: '24h' }); // Expires in 24 hour
}

export function verifyJWT(token: string) {
  try {
    const key = config.jwtKey
    if (key === undefined) throw new Error('unable to find key in config')
    const decoded = jwt.verify(token, key);
    return decoded as JwtPayload;
  } catch (error) {
    return { success: false, error: error.message };
  }
}