import { query } from "../database/database.js"
import { comparePassword, hashPassword } from "../util/password.util.js"

/**
 * Function to create user
 * @param param0 user information
 * @returns user value, please scrub before passing to client
 */
export const createUser = async ({ username, email, password }: ICreateUser) => {
  const result = await query<IUser>(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`, [username, email, password])
  return result[0]
}


/**
 * Update user, partial updates allowed
 * @param user update user value
 * @param id user id
 * @returns user information, please scrub before passing back to client
 */
export const updateUser = async (user: IUpdateUser, id: string) => {
  const currentUser = await getUser({ id })
  const updates: string[] = []
  let queryText = "UPDATE users SET"

  if (user.username) {
    updates.push(user.username)
    // allow for partial updates
    queryText = `${queryText} username=$${updates.length}`
  }
  if (user.password && user.existingPassword && currentUser) {
    const verified = await comparePassword(user.existingPassword, currentUser?.password)
    if (verified === false) throw { message: "unable to verify current password, will not proceed", status: 403 }
    updates.push(await hashPassword(user.password))
    // allow for partial updates
    // append a comma if something else is in array
    // otherwise don't
    // this will not occur for username, as it is first, so this is not done there
    queryText = `${queryText}${updates.length > 1 ? "," : ""} password=$${updates.length}`
  }
  if (user.email) {
    updates.push(user.email)
    queryText = `${queryText}${updates.length > 1 ? "," : ""} email=$${updates.length}`
  }

  updates.push(id)
  queryText = `${queryText} WHERE id=$${updates.length} RETURNING *;`

  const res = await query<IUser>(queryText, updates)
  return res[0]
}

//get all users, currently unused
export const getUsers = async () => {
  return await query<IUser>("SELECT * FROM users;")
}


/**
 * A function to get user information
 * @param param0 object containing which value is being queried, order of query will always be email, id, username in that order. If nothing is passed this will result in an error
 * @returns user information, will include the full object, please scrub user if being passed to client
 */
export const getUser = async ({ email, id, username }: IGetUser) => {
  let result: IUser | null = null
  if (email) {
    const r = await query<IUser>(`SELECT * FROM users WHERE email=$1`, [email])
    result = r[0]
  }
  if (id) {
    const r = await query<IUser>(`SELECT * FROM users WHERE id=$1`, [id])
    result = r[0]
  }
  if (username) {
    const r = await query<IUser>(`SELECT * FROM users WHERE username=$1`, [username])
    result = r[0]
  }
  if (result === null) {
    const message = "unable to find user given constraints"
    console.error(message, 'get user error')
    throw { message, status: 404 }
  }
  return result
}