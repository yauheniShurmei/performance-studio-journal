import NavigationBar from "../NavigationBar/NavigationBar";
import classes from "./Layout.module.scss";

const Layout = (props) => {
  return (
    <div className={classes.main}>
      <NavigationBar />
      {props.children}
    </div>
  );
};

export default Layout;
