import { JwtPayload } from "jsonwebtoken";
//this makes this file a module and ensures that the user type is correctly propagated 
export { }

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}