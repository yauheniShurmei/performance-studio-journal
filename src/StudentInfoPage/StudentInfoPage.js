import { useEffect, useState, useRef } from "react";
import useInput from "../hooks/use-input";
import classes from "./StudentInfoPage.module.scss";

const StudentInfoPage = (props) => {
  const [classesDynamic, setClassesDynamic] = useState(classes.main);
  const changedName = useRef();
  const lessonDuration = useRef();
  const [lessonsHistory, setLessonsHistory] = useState(null);

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
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    loadedNameHandler: loadedNameHandler,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    resetTouch: resetNameInput,
  } = useInput((value) => value.trim() !== "");
  // ------------------- CUSTOM HOOK USE INPUT -------------------

  const getStudentLessons = () => {
    fetch(
      `https://performance-lessons-default-rtdb.firebaseio.com/students/${student.key}/lessons.json`
    )
      .then((res) => res.json())
      .then((data) => {
        setLessonsHistory(data);
      });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("[SUBMIT HANDLER]");
    const newName = enteredName;
    const newLessonDuration = lessonDuration.current.value;
    fetch(
      `https://performance-lessons-default-rtdb.firebaseio.com/students/${student.key}/lessonDuration.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: newLessonDuration,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        props.dataIsChange();
      });
    console.log(newName);
  };

  useEffect(() => {
    props.isOpen
      ? setClassesDynamic([classes.main, classes.open].join(" "))
      : setClassesDynamic([classes.main, classes.close].join(" "));
    lessonDuration.current.value = student.lessonDuration;
    getStudentLessons();
    student.name && loadedNameHandler(student.name);
    resetNameInput();
  }, [props.isOpen]);

  let lessonsHistoryRender =
    lessonsHistory !== null ? (
      Object.keys(lessonsHistory).map((key) => {
        return <li key={key}>{key}</li>;
      })
    ) : (
      <li>Nie ma danych</li>
    );

  return (
    <div>
      {props.isOpen && (
        <div className={classes.backdrop} onClick={props.openCloseHandler} />
      )}
      <section className={classesDynamic}>
        <h1>{student.name}</h1>
        <form id="form" className={classes.form} onSubmit={submitHandler}>
          <label>zmienić imie</label>
          <input
            value={enteredName}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
          />
          {nameInputHasError && <p>pole nie może być pustym</p>}
          <label>długość lekcji</label>
          <select id="lessonDuration" ref={lessonDuration}>
            <option value={45}>45 minut</option>
            <option value={30}>30 minut</option>
          </select>
          <ul>{lessonsHistoryRender}</ul>
          <button form="form" type="submit" disabled={nameInputHasError}>
            AKTUALIZACJA DANYCH
          </button>
        </form>
        <button onClick={props.openAndChangeStudentInfoHandler}>ZAMKNIJ</button>
      </section>
    </div>
  );
};

export default StudentInfoPage;
