//primarily using css modules for ease
import { Outlet, useNavigate } from "react-router-dom";
import { NavItem } from "./components/NavItem/NavItem.tsx";
import styles from "./Root.module.css";
import { useAuthStore } from "./stores/auth.store.ts";
import axios from "axios";
import { useGetCurrentUserQuery } from "./hooks/user.hooks.ts";

export const Root = () => {
  const isAuth = useAuthStore((state) => state.auth);
  const removeUser = useAuthStore((state) => state.removeUser);
  const nav = useNavigate();
  useGetCurrentUserQuery();

  //this is the root layout element including nav
  return (
    <>
      <main>
        <div className={styles.nav}>
          <NavItem path="/" label="Home" />
          <NavItem path="/timers" label="Timers" />
          {/* if authorized render a sign out button, otherwise give signin or signup options */}
          {isAuth ? (
            <>
              <a
                onClick={async () => {
                  const res = await axios.get<boolean>(
                    "http://localhost:3000/auth/signout",
                    { withCredentials: true }
                  );

                  if (res.data) {
                    removeUser();
                    nav("/");
                  }
                  if (res.status >= 400) {
                    alert("unable to sign out");
                  }
                }}
                className={styles.signOutButton}
              >
                Sign Out
              </a>
            </>
          ) : (
            <>
              <NavItem path="/signup" label="Sign Up" />
              <NavItem path="/signin" label="Sign In" />
            </>
          )}
        </div>
        <Outlet />
      </main>
    </>
  );
};
