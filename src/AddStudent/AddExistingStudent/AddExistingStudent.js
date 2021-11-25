import { useContext, useEffect } from "react";
import { useState } from "react/cjs/react.development";
import Card from "../../Card/Card";
import AuthContext from "../../store/auth-context";

const AddExistingStudent = (props) => {
  const authCtx = useContext(AuthContext);

  const students = [];
  const studentsObj = Object.keys(authCtx.studentsFromCurrentYear).map(
    (key) => {
      if (authCtx.studentsFromCurrentYear[key].lessons[props.date[0]]) {
      } else {
        students.push(authCtx.studentsFromCurrentYear[key]);
      }
      return authCtx.studentsFromCurrentYear[key];
    }
  );
  console.log(students);

  //   props.isOpen &&
  //     fetch(
  //       "https://performance-lessons-default-rtdb.firebaseio.com/students.json"
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         const students = Object.keys(data).map((key) => {
  //           data[key].key = key;
  //           return data[key];
  //         });
  //         const studentsList = students.filter((student) => {
  //           if (!student.lessons[props.date]) {
  //             return student;
  //           }
  //         });
  //         setStudents(studentsList);
  //         // props.onStudentAdd();
  //       });

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
        // openStudentsListHandler();
      });
  };

  return (
    <Card isOpen={props.isOpen} openCloseHandler={props.openCloseHandler}>
      <section>
        <h1>Uczniowie z Tego Roku</h1>
        <ul>
          {students.length !== 0 && students !== "undefined"
            ? students.map((student) => {
                console.log(student);
                return (
                  <li
                    key={student.student_profile.key}
                    // onClick={() => addStudentHandler(student)}
                  >
                    {student.student_profile.name +
                      " " +
                      student.student_profile.familyName}
                  </li>
                );
              })
            : null}
        </ul>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              props.openCloseHandler();
            }}
          >
            COFNIJ
          </button>
        </div>
      </section>
    </Card>
  );
};

export default AddExistingStudent;
