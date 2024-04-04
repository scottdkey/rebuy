import styles from "./Auth.module.css";
import { useSignInMutation } from "../../hooks/auth.hooks.ts";

export const SignIn = () => {
  const { mutateAsync } = useSignInMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: ISignInUser = {
      username: event.currentTarget.username.value,
      password: event.currentTarget.password.value,
    };

    await mutateAsync(data);
  };
  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <label htmlFor="username">username</label>
      <input name="username" className={styles.formInput} required />
      <label htmlFor="password">password</label>
      <input
        type="password"
        className={styles.formInput}
        name="password"
        required
      />
      <button className={styles.submitButton} type="submit">
        Submit
      </button>
    </form>
  );
};
