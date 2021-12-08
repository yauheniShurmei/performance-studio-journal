import classes from "./AddNewStudent.module.scss";
import { MONTHS, YEARS } from "../../Table/DATE";
import { useRef, useState } from "react";
import { useContext } from "react/cjs/react.development";
import AuthContext from "../../store/auth-context";

const NewStudent = (props) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(
    new Date().getMonth() > 8
      ? new Date().getMonth() + 1
      : `0${new Date().getMonth() + 1}`
  );
  const authCtx = useContext(AuthContext);
  const lessonDuration = useRef();

  const [enteredName, setEnteredName] = useState("");
  const [enteredFamilyName, setEnteredFamilyName] = useState("");
  const [enteredNameTouched, setEnteredNameTouched] = useState(false);
  const [enteredFamilyNameTouched, setEnteredFamilyNameTouched] =
    useState(false);

  const enteredNameIsValid = enteredName !== "";
  const enteredFamilyNameIsValid = enteredFamilyName !== "";
  const inputNameIsValid = !enteredNameIsValid && enteredNameTouched;
  const inputFamilyNameIsValid =
    !enteredFamilyNameIsValid && enteredFamilyNameTouched;

  let formIsValid = false;

  if (enteredNameIsValid && enteredFamilyNameIsValid) {
    formIsValid = true;
  }

  // -----------onBlur -----------------------
  const inputNameBlurHandler = () => {
    setEnteredNameTouched(true);
  };
  const inputFamilyNameBlurHandler = () => {
    setEnteredFamilyNameTouched(true);
  };
  // -----------onBlur -----------------------
  // -----------onChange -----------------------
  const checkNameIsValid = (event) => {
    setEnteredName(event.target.value);
  };
  const checkFamilyNameIsValid = (event) => {
    setEnteredFamilyName(event.target.value);
  };
  // -----------onChange -----------------------
  // ---------------------------------CREATE NEW STUDENT -----------------------
  const sendDataHandler = (event) => {
    event.preventDefault();
    setEnteredNameTouched(true);
    setEnteredFamilyNameTouched(true);
    if (!enteredNameIsValid && !enteredFamilyNameIsValid) {
      return;
    }
    const student = {
      lessons: {},
      student_profile: {
        lessonDuration: Number(lessonDuration.current.value),
        name: enteredName,
        familyName: enteredFamilyName,
      },
    };
    student.lessons[month] = [0, 0, 0, 0, 0, 0, 0, 0];

    fetch(
      `https://performance-lessons-default-rtdb.firebaseio.com/users/${authCtx.localId}/work_years/${year}.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        props.onStudentAdd();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setEnteredName("");
    setEnteredFamilyName("");
    setEnteredNameTouched(false);
    setEnteredFamilyNameTouched(false);
  };
  // -------------------------------------CREATE NEW STUDENT -----------------------

  const changeMonthHandler = (event) => {
    setMonth(event.target.value);
  };
  const changeYearHandler = (event) => {
    setYear(event.target.value);
  };

  return (
    <section className={classes.main}>
      <h1>Dodaj Nowego Ucznia</h1>
      <form onSubmit={sendDataHandler}>
        <label htmlFor="name">Imie</label>
        <input
          value={enteredName}
          onChange={checkNameIsValid}
          onBlur={inputNameBlurHandler}
          id="name"
          type="text"
        />
        {inputNameIsValid && (
          <p className={classes.error_message}>Imię jest wymagane</p>
        )}
        <label htmlFor="familyName">Nazwisko</label>
        <input
          id="familyName"
          type="text"
          value={enteredFamilyName}
          onChange={checkFamilyNameIsValid}
          onBlur={inputFamilyNameBlurHandler}
        />
        {inputFamilyNameIsValid && (
          <p className={classes.error_message}>Nazwisko jest wymagane</p>
        )}
        <label>Długość lekcji</label>
        <select id="lessonDuration" ref={lessonDuration}>
          <option value={45}>45 minut</option>
          <option value={30}>30 minut</option>
        </select>
        <label>Miesiąc rospoczęcia zajęć</label>
        <div>
          <select value={year} onChange={changeYearHandler}>
            {YEARS.map((year) => {
              return (
                <option key={year.value} value={year.value}>
                  {year.year}
                </option>
              );
            })}
          </select>
          <select value={month} id="month-select" onChange={changeMonthHandler}>
            {MONTHS.map((month) => {
              return (
                <option key={month.value} value={month.value}>
                  {month.month}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <button disabled={!formIsValid}>DODAJ</button>
          <button
            onClick={(e) => {
              e.preventDefault();
              props.openCloseHandler();
            }}
          >
            COFNIJ
          </button>
        </div>
      </form>
    </section>
  );
};

export default NewStudent;
