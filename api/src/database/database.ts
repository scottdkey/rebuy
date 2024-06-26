
import pg from "pg";
import { config } from "../config.js";
import { snakeToCamel } from "../util/snakeToCamel.util.js";

//creation of a simple database connection pool with a generic query
//this query function will take  SQL as text, and an array of params
// string interpolation should never be used in this application, as that could cause issues with SQL injection, the PG library automatically handles that issue for us, while maintaining a simple DSL to write queries as well as type the results
const pool = new pg.Pool(config.postgres)

/**
 * Function to query database
 * @param text query text, should conform to PostgreSQL standard
 * @param params array of params, can be any type
 * @returns value typed to generic type passed in. if Nothing is passed this will be unknown type
 */
export const query = async <T extends pg.QueryResultRow>(text: string, params?: any[]) => {
  const client = await pool.connect()
  try {

    const data = await client.query<T>(text, params)
    await client.release()
    if (data.rows) {
      return data.rows.map((row: any) => {
        const incoming = row

        //parse dates to isoString automatically
        const dateValuesToParse = ["created_at", "updated_at", "start_time", "end_time"]
        dateValuesToParse.forEach(value => {
          if (incoming[value]) incoming[value] = new Date(incoming[value]).toISOString()
        })
        // automatically map any snakeCase key to camelCase to conform with javascript standard
        // leave values alone
        return snakeToCamel(incoming) as T
      })
    } else {
      throw { message: "no values found", status: 404 }
    }

    // all errors are caught within the error handler middleware
    // we may want to reassign things from a specific context to provide value downstream
  } catch (e) {
    //default error and status, may be reassigned later
    let status = 500
    let message = e.message || "postgres error"

    //error code for undefined value
    // as more error codes are caught, they can be assigned correctly from here
    // as this grows this might become a util function with all postgres errors
    if (e.code === "22P02") {
      status = 400
      message = "one of the expected values is undefined"
    }
    console.error(e, 'postgres error')
    throw { message, status }
  }

}