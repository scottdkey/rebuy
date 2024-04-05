import { query } from "../database/database.js"

/**
 * 
 * @param userId 
 * @returns All tasks tied to a particular user
 */
export const getHistoryByUserId = async (userId: string) => {
  return await query<IHistory[]>(`SELECT * FROM history WHERE user_id=$1;`, [userId])
}


/**
 * 
 * @param id task id
 * @returns single task
 */
export const getHistoryById = async (id: string) => {
  const res = await query<IHistory>(`SELECT * FROM history WHERE id = $1;`, [id])
  return res[0]
}

/**
 * 
 * @param param0 create task value
 * @param userId 
 * @returns task
 */
export const createHistory = async ({ startTime }: ICreateHistory, userId: string) => {
  const res = await query<IHistory>(`INSERT INTO history (user_id, start_time) VALUES ($1, $2) RETURNING *;`, [userId, startTime])
  return res[0]
}

/**
 * 
 * @param param0 update task value
 * @param id task id
 * @returns task
 */
export const updateHistory = async ({ endTime, completedTasks, pauses }: IUpdateHistory, id: string) => {
  const res = await query<IHistory>(`UPDATE history SET end_time=$1, completed_tasks=$2, pauses=$3 WHERE id=$4 RETURNING *;`, [endTime, completedTasks, pauses, id])
  return res[0]
}

/**
 * 
 * @param id task id
 * @returns success or failure status
 */
export const deleteHistory = async (id: string) => {
  try {
    await query(`DELETE FROM history WHERE id=$1;`, [id])
    return true
  } catch (e) {
    console.error(e, 'unable to delete task')
    return false
  }
}