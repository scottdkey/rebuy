import { query } from "../database/database.js"

/**
 * 
 * @param userId 
 * @returns All tasks tied to a particular user
 */
export const getHistoryByUserId = async (userId: string) => {
  return await query<ITask[]>(`SELECT * FROM tasks WHERE user_id=$1;`, [userId])
}


/**
 * 
 * @param id task id
 * @returns single task
 */
export const getHistoryById = async (id: string) => {
  const res = await query<ITask>(`SELECT * FROM tasks WHERE id = $1;`, [id])
  return res[0]
}

/**
 * 
 * @param param0 create task value
 * @param userId 
 * @returns task
 */
export const createHistory = async ({ taskName, description }: ICreateTask, userId: string) => {
  const res = await query<ITask>(`INSERT INTO tasks (user_id, task_name, description) VALUES ($1, $2, $3) RETURNING *;`, [userId, taskName, description])
  return res[0]
}

/**
 * 
 * @param param0 update task value
 * @param id task id
 * @returns task
 */
export const updateHistory = async ({ taskName, description, complete }: IUpdateTask, id: string) => {
  const res = await query<ITask>(`UPDATE tasks SET task_name=$1, description=$2, complete=$3 WHERE id=$4 RETURNING *;`, [taskName, description, complete, id])
  return res[0]
}

/**
 * 
 * @param id task id
 * @returns success or failure status
 */
export const deleteHistory = async (id: string) => {
  try {
    await query(`DELETE FROM tasks WHERE id=$1;`, [id])
    return true
  } catch (e) {
    console.error(e, 'unable to delete task')
    return false
  }
}