import { useState } from "react";
import classes from "./AddStudent.module.scss";
import AddExistingStudent from "./AddExistingStudent/AddExistingStudent";

const AddStudent = (props) => {
  // console.log("[ADD_STUDENT_FROM_LIST.JS]");
  const [isOpenExistStList, setIsOpenExistStList] = useState(false);

  const openCloseInfoPageHandler = () => {
    setIsOpenExistStList(!isOpenExistStList);
  };

  return (
    <div className={classes.main}>
      <button onClick={openCloseInfoPageHandler}>DODAĆ UCZNIÓW</button>
      {isOpenExistStList && (
        <AddExistingStudent
          openCloseHandler={openCloseInfoPageHandler}
          date={props.date}
          onStudentAdd={props.onStudentAdd}
        />
      )}
    </div>
  );
};

export default AddStudent;
