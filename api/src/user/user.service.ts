import { hashPassword } from "../util/password.util.js"
import { createUser as repoCreateUser, getUser, updateUser as repoUpdateUser } from "./user.repository.js"



export const createUser = async (user: ICreateUser) => {
  const password = await hashPassword(user.password)
  const existingUser = await getUser({ username: user.username, email: user.email })
  if (existingUser) {
    throw {
      status: 409,
      message: "must have unique username or email, one of those values exists"
    }
  }
  return await repoCreateUser({ ...user, password })
}

export const updateUser = async (user: IUpdateUser, id: string) => {
  return await repoUpdateUser(user, id)
}