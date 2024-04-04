import { query } from "../database/database.js"
import { comparePassword, hashPassword } from "../util/password.util.js"

export const createUser = async ({ username, email, password }: { username: string, email: string, password: string }) => {
  const result = await query<IUser>(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`, [username, email, password])
  return result[0]
}


//update user with partial updates
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
    if (verified === false) throw { message: { message: "unable to verify current password, will not proceed" }, status: 403 }
    updates.push(await hashPassword(user.password))
    // allow for partial updates
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


// allow for multiple queries for user based in various values like email, id, or username
export const getUser = async ({ email, id, username }: { email?: string, id?: string, username?: string }) => {
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
    console.error("unable to find user given constraints")
  }
  return result
}