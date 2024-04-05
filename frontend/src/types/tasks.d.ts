// while not ideal, these types have been copied from the server
// for the purposes of this exercise using the types from the other folder is not setup, but could be for an optimal development experience
interface ICreateTask {
  taskName: string
  description: string
}


interface IUpdateTask extends ICreateTask {
  complete: boolean
}

interface ITask extends IUpdateTask {
  id: string,
  userId: string
}