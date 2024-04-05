import { hashPassword } from "../util/password.util.js"
import { createUser as repoCreateUser, getUser, updateUser as repoUpdateUser } from "./user.repository.js"

// in this repo I'm only using services to modify data coming from the repository
/**
 * Function to create user
 * @param user create user value
 * @returns user value, please scrub before passing to client
 */
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

// this function is only calling the repo, but since this service is here, for application conformity this function is here
/**
 * Function to update user
 * @param user update user value
 * @param id user id
 * @returns user value, please scrub before passing to client
 */
export const updateUser = async (user: IUpdateUser, id: string) => {
  return await repoUpdateUser(user, id)
}