
// using cascading types with inheritance allows each type to be unique but ensure that our types stay in sync
// if a value is added to create later, update and the Task type will get that automatically
interface ICreateTask {
  taskName: string
  description: string
}

// this has all of the createTask values
interface IUpdateTask extends ICreateTask {
  complete: boolean
}

// this has all of the previous values
interface ITask extends IUpdateTask {
  id: string,
  userId: string
}