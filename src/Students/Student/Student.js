import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./Student.module.scss";

const Student = (props) => {
  console.log("[STUDENT.JS]");

  const [lessons, setLessons] = useState(props.student.lessons);
  const [newDate, setNewDate] = useState();
  const authCtx = useContext(AuthContext);

  const sendDataHandler = (newDate) => {
    fetch(
      `https://performance-lessons-default-rtdb.firebaseio.com/users/${authCtx.localId}/work_years/${newDate.date[1]}/${newDate.key}/lessons/${newDate.date[0]}/${newDate.index}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: newDate.value === "" ? 0 : JSON.stringify(newDate.value),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        props.dataIsChange();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeDateHandler = (event, index, key, date) => {
    const newDate = {
      value: event.target.value,
      index: index,
      key: key,
      date: date,
    };
    setNewDate(newDate);
    setLessons((prevState) => {
      const lessons = [...prevState];
      lessons[newDate.index] = newDate.value === "" ? 0 : newDate.value;
      return lessons;
    });
  };

  useEffect(() => {
    console.log("[STUDENT USE EFFECT]");
    setLessons(props.student.lessons);
  }, [props.student.lessons]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("[STUDENT] [USE EFEECT] [SEND DATA HANDLER]");
      newDate && sendDataHandler(newDate);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [newDate]);

  const howManyLessonsAreLeft = (lessons) => {
    const leftCheck =
      typeof props.student.leftFromLastMonth !== "undefined"
        ? props.student.leftFromLastMonth
        : 0;
    const leftLessons =
      lessons.reduce((prev, curr) => {
        return curr !== 0 ? prev - 1 : prev - 0;
      }, 4) + leftCheck;
    return leftLessons === 0 ? "" : leftLessons;
  };

  return (
    <tr className={classes.main}>
      <th onClick={() => props.openAndChangeStudentInfoHandler(props.student)}>
        {props.student.name}
      </th>
      {lessons.map((lesson, index) => {
        return (
          <td key={index}>
            <input
              value={lesson === 0 ? "" : lesson}
              onChange={
                (event) =>
                  changeDateHandler(event, index, props.student.key, props.date)
                // changeLessonData(event, index, props.student.key, props.date)
              }
            />
          </td>
        );
      })}
      <td>
        {props.student.leftFromLastMonth === 0
          ? ""
          : props.student.leftFromLastMonth}
      </td>
      <td>{howManyLessonsAreLeft(lessons)}</td>
    </tr>
  );
};

export default Student;
