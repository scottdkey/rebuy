import { query } from "../database/database.js"
import { snakeToCamel } from "../util/snakeToCamel.util.js"

export const createPomodoro = async ({ userId, nickname, timerTime, shortBreakTime, longBreakTime }: { userId: string, nickname: string, timerTime: number, shortBreakTime: number, longBreakTime: number }) => {
  const text = `INSERT INTO pomodoro(user_id, nickname, timer_time, short_break_time, long_break_time) VALUES ($1, $2, $3, $4, $5) RETURNING *;`
  const params = [userId, nickname, timerTime, shortBreakTime, longBreakTime]
  const result = await query<IPomodoro>(text, params)
  return snakeToCamel(result[0])
}

export const getPomodoros = async (userId: string) => {
  return await query<IPomodoro>(`SELECT * FROM pomodoro WHERE user_id=$1;`, [userId])
}

export const getPomodorosByUserId = async (userId: string) => {
  return await query<IPomodoro>(`SELECT * FROM pomodoro WHERE user_id=$1;`, [userId])
}

export const getPomodoroById = async (id: string) => {
  const res = await query<IPomodoro>(`SELECT * FROM pomodoro WHERE id = $1;`, [id])
  return res[0]
}

export const updatePomodoro = async ({ timerTime, shortBreakTime, longBreakTime, id, nickname }: { timerTime: number, shortBreakTime: number, longBreakTime: number, id: string, nickname: string }) => {
  const res = await query<IPomodoro>(`UPDATE pomodoro SET timer_time = $1, short_break_time = $2, long_break_time=$3, nickname=$5 WHERE id = $4 RETURNING *;`, [timerTime, shortBreakTime, longBreakTime, id, nickname])
  return res[0]
}

export const deletePomodoro = async (id: string) => {
  try {
    const text = `DELETE FROM pomodoro WHERE id=$1;`
    const params = [id]
    await query(text, params)
    return true
  } catch (e) {
    console.error(e, 'unable to delete pomodoro')
    return false
  }
}