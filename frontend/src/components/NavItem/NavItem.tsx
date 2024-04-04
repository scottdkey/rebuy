import { Link, useLocation } from "react-router-dom";
import styles from "./NavItem.module.css";

export const NavItem = ({ path, label }: { path: string; label: string }) => {
  const location = useLocation();
  return (
    <Link
      className={`${styles.navItem} ${
        location.pathname === path ? styles.navActive : ""
      }`}
      to={path}
    >
      {label}
    </Link>
  );
};
