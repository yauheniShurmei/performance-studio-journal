import classes from "./NavigationBar.module.scss";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../store/auth-context";

const NavigationBar = () => {
  const location = useLocation();
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <section className={classes.section}>
      <nav>
        <ul>
          <div>
            <li>
              <NavLink
                //   style={({ isActive }) => {
                //     return {
                //       display: "block",
                //       margin: "1rem 0",
                //       color: isActive ? "red" : "",
                //     };
                //   }}
                to={!isLoggedIn ? "/" : "/table"}
                onClick={() => authCtx.resetDate()}
              >
                Performanse Studio Dziennik
              </NavLink>
            </li>
          </div>
          <div>
            {!isLoggedIn && location.pathname !== "/login" && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link to="#">Profile</Link>
              </li>
            )}
          </div>
        </ul>
      </nav>
    </section>
  );
};

export default NavigationBar;
