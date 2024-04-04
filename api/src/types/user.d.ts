interface IUser {
  id: string,
  username: string,
  email: string,
  password: string
}
interface ICreateUser {
  username: string
  email: string
  password: string
}

interface IUpdateUser extends ICreateUser {
  existingPassword?: string
  password?: string
}


interface JwtPayload {
  id: string
  username: string
}