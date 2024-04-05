
import pg from "pg";
import { config } from "../config.js";
import { snakeToCamel } from "../util/snakeToCamel.util.js";

//creation of a simple database connection pool with a generic query
//this query function will take  SQL as text, and an array of params
// string interpolation should never be used in this application, as that could cause issues with SQL injection, the PG library automatically handles that issue for us, while maintaining a simple DSL to write queries as well as type the results
const pool = new pg.Pool(config.postgres)

export const query = async <T extends pg.QueryResultRow>(text: string, params?: any[]) => {
  const client = await pool.connect()
  try {

    const data = await client.query<T>(text, params)
    await client.release()
    if (data.rows) {
      return data.rows.map((row: any) => {
        const incoming = row
        //parse dates to isoString automatically
        if (incoming["created_at"]) incoming["created_at"] = new Date(incoming['created_at']).toISOString()
        if (incoming["updated_at"]) incoming["updated_at"] = new Date(incoming['updated_at']).toISOString()

        // automatically map any snake cause value to camelcase
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