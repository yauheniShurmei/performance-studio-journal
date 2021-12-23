import { useEffect, useState, useRef, useContext } from "react";
import Card from "../Card/Card";
import useInput from "../hooks/use-input";
import AuthContext from "../store/auth-context";
import classes from "./StudentInfoPage.module.scss";
import LessonsHistoryOfStudent from "../LessonsHistoryOfStudent/LessonsHistoryOfStudent";

const StudentInfoPage = (props) => {
  const authCtx = useContext(AuthContext);
  const lessonDuration = useRef();
  const [lessonsHistory, setLessonsHistory] = useState([]);
  const [lessonHistoryToSend, setLessonHistoryToSend] = useState([]);

  // ------------------- CHECK AND GET STUDENT -------------------
  const student =
    typeof props.selectedStudentForChange !== "undefined" ? (
      props.selectedStudentForChange
    ) : (
      <div>
        <h1>Nie ma Studenta</h1>
      </div>
    );
  // ------------------- CHECK AND GET STUDENT -------------------

  // ------------------- CUSTOM HOOK USE INPUT -------------------
  const {
    value: enteredName,
    // isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    loadedNameHandler,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    resetTouch: resetNameInput,
  } = useInput((value) => value.trim() !== "");
  const {
    value: enteredFamilyName,
    // isValid: enteredFamilyNameIsValid,
    hasError: familyNameInputHasError,
    loadedNameHandler: loadedFamilyNameHandler,
    valueChangeHandler: familyNameChangeHandler,
    inputBlurHandler: familyNameBlurHandler,
    // resetTouch: resetFamilyNameInput,
  } = useInput((value) => value.trim() !== "");
  // ------------------- CUSTOM HOOK USE INPUT -------------------

  useEffect(() => {
    // console.log("[USE EFFECT STUDENT INFO PAGE]");
    getStudentLessons();
    lessonDuration.current.value = student.lessonDuration;
    student.name && loadedNameHandler(student.name);
    student.familyName && loadedFamilyNameHandler(student.familyName);
    resetNameInput();
  }, [props.isOpen]);

  const getStudentLessons = () => {
    fetch(
      `https://performance-lessons-default-rtdb.firebaseio.com/users/${authCtx.localId}/work_years.json`
    )
      .then((res) => res.json())
      .then((data) => {
        const years = [];
        const month = {};
        Object.keys(data).map((year) => {
          if (data[year][props.selectedStudentForChange.key]) {
            years.push(year);
            month[year] = Object.keys(
              data[year][props.selectedStudentForChange.key].lessons
            );
          }
          return null;
        });
        setLessonHistoryToSend(month);
        setLessonsHistory(years);
      });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const newName = enteredName;
    const newFamilyName = enteredFamilyName;
    const newLessonDuration = lessonDuration.current.value;

    const student_profile = {
      key: props.selectedStudentForChange.key,
      familyName: newFamilyName,
      lessonDuration: newLessonDuration,
      name: newName,
    };

    for (let year of lessonsHistory) {
      // console.log(year);
      fetch(
        `https://performance-lessons-default-rtdb.firebaseio.com/users/${authCtx.localId}/work_years/${year}/${props.selectedStudentForChange.key}/student_profile.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(student_profile),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          props.dataIsChange();
        });
    }
  };

  return (
    <Card openCloseHandler={props.openCloseHandler}>
      <section className={classes.main}>
        <form id="form" className={classes.form} onSubmit={submitHandler}>
          <h1>{`${student.name} ${student.familyName}`}</h1>

          <label>zmienić imie</label>
          <input
            value={enteredName}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
          />
          {nameInputHasError && <p>pole nie może być pustym</p>}
          <label>nazwisko</label>
          <input
            value={enteredFamilyName}
            onChange={familyNameChangeHandler}
            onBlur={familyNameBlurHandler}
          />
          {familyNameInputHasError && <p>pole nie może być pustym</p>}
          <label>długość lekcji</label>
          <select id="lessonDuration" ref={lessonDuration}>
            <option value={45}>45 minut</option>
            <option value={30}>30 minut</option>
          </select>
          <LessonsHistoryOfStudent lessonsHistory={lessonHistoryToSend} />
          <button form="form" type="submit" disabled={nameInputHasError}>
            AKTUALIZACJA DANYCH
          </button>
          <button onClick={props.openAndChangeStudentInfoHandler}>
            ZAMKNIJ
          </button>
        </form>
      </section>
    </Card>
  );
};

export default StudentInfoPage;
