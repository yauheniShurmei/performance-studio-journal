import { useContext } from "react";
import Card from "../Card/Card";
import AuthContext from "../store/auth-context";
import classes from "./ConfirmWindow.module.scss";

const ConfirmWindow = (props) => {
  const authCtx = useContext(AuthContext);

  const confirmToDelete = () => {
    authCtx.deleteStudentHandler(
      props.studentToDeleteInformation.key,
      props.dataIsChange,
      props.openCloseHandler
    );
  };

  return (
    <Card openCloseHandler={props.openCloseHandler}>
      <section className={classes.main}>
        {`Naprawde chcesz usunąnć ucznia
        ${props.studentToDeleteInformation.name} 
        ${props.studentToDeleteInformation.familyName} 
        z tego miesąca?`}
        <div>
          <button onClick={confirmToDelete}>Tak</button>
          <button onClick={props.openCloseHandler}>Nie. Żartowałem</button>
        </div>
      </section>
    </Card>
  );
};

export default ConfirmWindow;
