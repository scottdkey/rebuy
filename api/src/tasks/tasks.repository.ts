import { query } from "../database/database.js"
import { snakeToCamel } from "../util/snakeToCamel.util.js"

export const createTask = async ({ userId, taskName, description }: { userId: string, taskName: string, description: string }) => {
  const result = await query<ITasks>(`INSERT INTO tasks (user_id, task_name, description) VALUES ($1, $2, $3) RETURNING *;`, [userId, taskName, description])
  return snakeToCamel(result[0])
}

export const getTasks = async () => {
  return await query<ITasks>("SELECT * FROM tasks;")
}

export const getTasksByUserId = async (userId: string) => {
  return await query<ITasks>(`SELECT * FROM tasks WHERE user_id=$1;`, [userId])
}

export const getTaskById = async (id: string) => {
  const res = await query<ITasks>(`SELECT * FROM tasks WHERE id = $1;`, [id])
  return res[0]
}

export const updateTask = async ({ taskName, description, id }: { taskName: string, description: string, id: string }) => {
  const res = await query<ITasks>(`UPDATE tasks SET task_name = $1, description = $2 WHERE id = $3 RETURNING *;`, [taskName, description, id])
  return res[0]
}

export const deleteTask = async (id: string) => {
  try {
    await query(`DELETE FROM tasks WHERE id = $1;`, [id])
    return true
  } catch (e) {
    console.error(e, 'unable to delete task')
    return false
  }
}