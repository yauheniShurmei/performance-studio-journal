import Student from "./Student/Student";
import classes from "./Students.module.scss";

const Students = (props) => {
  console.log("[STUDENTS.JS]");

  if (
    !props.students ||
    typeof props.students == "undefined" ||
    props.students.length === 0
  ) {
    return (
      <tr className={classes.main}>
        <th colSpan={11}>w tym miesiącu jeszcze nie dodałeś zajęć</th>
      </tr>
    );
  }

  return props.students.map((student) => {
    return (
      <Student
        key={student.key}
        student={student}
        date={props.date}
        dataIsChange={props.dataIsChange}
        openAndChangeStudentInfoHandler={props.openAndChangeStudentInfoHandler}
      />
    );
  });
};

export default Students;
