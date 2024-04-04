import { hashPassword } from "../util/password.util.js"
import { createUser, getUser, updateUser } from "./user.repository.js"



export const validateAndCreateUser = async (user: ICreateUser) => {
  const password = await hashPassword(user.password)
  const existingUser = await getUser({ username: user.username, email: user.email })
  if (existingUser) {
    throw {
      status: 409,
      message: "must have unique username or email, one of those values exists"
    }
  }
  return await createUser({ ...user, password })
}

export const validateAndUpdateUser = async (user: IUpdateUser, id: string) => {
  return await updateUser(user, id)
}