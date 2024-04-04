interface JwtPayload {
  id: string
  username: string
}

interface ISignInUser {
  username: string;
  password: string;
}
interface ISignUpUser extends ISignInUser {
  email: string;
}