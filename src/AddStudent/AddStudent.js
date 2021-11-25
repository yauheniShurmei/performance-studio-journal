import { useState } from "react";
import classes from "./AddStudent.module.scss";
import { Link } from "react-router-dom";
import AddExistingStudent from "./AddExistingStudent/AddExistingStudent";

const AddStudent = (props) => {
  console.log("[ADD_STUDENT_FROM_LIST.JS]");
  const [students, setStudents] = useState([]);
  const [isOpenList, setIsOpenList] = useState(false);
  const [isOpenExistStList, setIsOpenExistStList] = useState(false);

  const openStudentsListHandler = () => {
    setIsOpenList(!isOpenList);
    fetch(
      "https://performance-lessons-default-rtdb.firebaseio.com/students.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const students = Object.keys(data).map((key) => {
          data[key].key = key;
          return data[key];
        });
        const studentsList = students.filter((student) => {
          if (!student.lessons[props.date]) {
            return student;
          }
        });
        setStudents(studentsList);
        props.onStudentAdd();
      });
  };

  const addStudentHandler = (student) => {
    console.log("[addStudentHandler FUNCTION]");
    const newStudentData = [0, 0, 0, 0, 0, 0, 0, 0];
    fetch(
      `https://performance-lessons-default-rtdb.firebaseio.com/students/${student.key}/lessons/${props.date}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudentData),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("ADDED STUDENT DATA");
        openStudentsListHandler();
      });
  };

  const openCloseInfoPageHandler = () => {
    setIsOpenExistStList(!isOpenExistStList);
  };

  return (
    <div className={classes.main}>
      {/* <button onClick={openStudentsListHandler}>DODAĆ UCZNIÓW Z LISTY</button> */}
      <Link to="/new-student">DODAĆ NOWEGO UCZNIA</Link>
      <button onClick={openCloseInfoPageHandler}>DODAĆ UCZNIÓW Z LISTY</button>
      <AddExistingStudent
        isOpen={isOpenExistStList}
        openCloseHandler={openCloseInfoPageHandler}
        students={students}
        date={props.date}
      />

      <ul style={isOpenList ? { display: "block" } : { display: "none" }}>
        {students.length !== 0
          ? students.map((student) => {
              return (
                <li
                  key={student.name}
                  onClick={() => addStudentHandler(student)}
                >
                  {student.name}
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
};

export default AddStudent;
