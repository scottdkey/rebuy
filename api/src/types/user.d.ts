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
  username?: string
  email?: string
  existingPassword?: string
  password?: string
}


interface JwtPayload {
  id: string
  username: string
}

interface IGetUser { email?: string, id?: string, username?: string }