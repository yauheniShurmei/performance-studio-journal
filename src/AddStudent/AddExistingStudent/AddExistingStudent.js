import { useContext, useEffect } from "react";
import { useState } from "react/cjs/react.development";
import Card from "../../Card/Card";
import AuthContext from "../../store/auth-context";
import AddNewStudent from "../AddNewStudent/AddNewStudent";
import classes from "./AddExistingStudent.module.scss";

const AddExistingStudent = (props) => {
  console.log("[AddExistingStudent]");
  const authCtx = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(props.date[1]);
  const [years, setYears] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [isNewStudentComponent, setIsNewStudentComponent] = useState(false);

  // ---------------------------  useEffect which run only First Time ---------------------------
  useEffect(() => {
    console.log("[USE EFFECT] ADD EXISTING STUDENT");
    // --------------------------- Get All Years For Options---------------------------
    fetch(
      `https://performance-lessons-default-rtdb.firebaseio.com/users/${authCtx.localId}/work_years.json`
    )
      .then((res) => res.json())
      .then((data) => {
        data && setYears([...Object.keys(data), "all"]);
      });
    // --------------------------- Get All Years For Options---------------------------
    getStudents(selectedYear);
  }, [props.date, selectedYear]);
  // ---------------------------  useEffect which run only First Time ---------------------------

  const addStudentHandler = (event) => {
    console.log("[addStudentHandler FUNCTION]");

    const student = {
      lessons: event.lessons,
      student_profile: event.student_profile,
    };
    student.lessons[props.date[0]] = [0, 0, 0, 0, 0, 0, 0, 0];

    fetch(
      `https://performance-lessons-default-rtdb.firebaseio.com/users/${authCtx.localId}/work_years/${props.date[1]}/${event.student_profile.key}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        props.onStudentAdd();
        props.openCloseHandler();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const changeHandler = (e) => {
    setStudents([]);
    setSelectedYear(e.target.value);
    getStudents(e.target.value);
    sortHandler(sortBy);
  };

  useEffect(() => {
    sortHandler(sortBy);
  }, [students]);

  const getStudents = (e) => {
    console.log("[getStudents FUNCTION]");
    const searchStudents = [];
    if (e === "all") {
      fetch(
        `https://performance-lessons-default-rtdb.firebaseio.com/users/${authCtx.localId}/work_years.json`
      )
        .then((res) => res.json())
        .then((data) => {
          // ----------------  get the object. data = {2020: {students}, 2021: {students}} ----------------
          const arrayOfYears = Object.keys(data); // arrayOfYears = ["2020", "2021"]
          const keysOfAllStudentsArray = [];

          for (let year of arrayOfYears) {
            Object.keys(data[year]).map((key) => {
              keysOfAllStudentsArray.push(key);
            });
          }

          for (let year of arrayOfYears) {
            // year = "2020"
            // ----------------  get the one year and push every student in list ----------------
            Object.keys(data[year]).map((key) => {
              // data[year] = {-Masffakjdbv: {lessons: {}, student_profile: {}}}
              // key = "-Masffakjdbv"
              if (
                authCtx.studentsFromCurrentYear[key]?.lessons[props.date[0]]
              ) {
                return null;
              } else {
                data[year][key].student_profile.key = key;
                searchStudents.push(data[year][key]);
                return null;
              }
            });
            // ----------------  get the one year and push every student in list ----------------
          }
          setStudents([...searchStudents]);
        });
    } else {
      fetch(
        `https://performance-lessons-default-rtdb.firebaseio.com/users/${authCtx.localId}/work_years/${e}.json`
      )
        .then((res) => res.json())
        .then((data) => {
          data &&
            Object.keys(data).map((key) => {
              if (
                authCtx.studentsFromCurrentYear[key]?.lessons[props.date[0]]
              ) {
                return null;
              } else {
                data[key].student_profile.key = key;
                searchStudents.push(data[key]);
                return null;
              }
            });
          setStudents([...searchStudents]);
        });
    }
  };

  const sortHandler = (e) => {
    const method = typeof e === "object" ? e.target.value : sortBy;
    if (method === "alfabetImie") {
      const sortedStudents = students.sort(function compare(a, b) {
        const nameA = a.student_profile.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.student_profile.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      setStudents(sortedStudents);
      if (typeof e === "object") {
        setSortBy(e.target.value);
      }
      setIsChanged(!isChanged);
    }
  };
  // switch between newStudent and ExistStudent
  const changeComponentHandler = (e) => {
    setIsNewStudentComponent(e);
  };
  // switch between newStudent and ExistStudent

  const sectionOne = (
    <div>
      <div>
        <select onChange={changeHandler} value={selectedYear}>
          {years.map((year) => {
            if (year === String(props.date[1])) {
              return <option key={year} value={year}>{`${year}`}</option>;
            }
            return <option key={year} value={year}>{`${year}`}</option>;
          })}
        </select>
        <select onChange={(e) => sortHandler(e)}>
          <option value={"default"}>-sortować-</option>
          <option value={"alfabetImie"}>
            sortować alfabetycznie po imieniu
          </option>
        </select>
      </div>
      <ul>
        {students.length !== 0 && students !== "undefined"
          ? students.map((student) => {
              return (
                <li
                  key={student.student_profile.key}
                  onClick={() => addStudentHandler(student)}
                >
                  {`${student.student_profile.name} ${student.student_profile.familyName}`}
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
    </div>
  );

  return (
    <Card openCloseHandler={props.openCloseHandler}>
      <section>
        <h1>Dodaj ucznia</h1>
        <div>
          <button onClick={() => changeComponentHandler(false)}>
            TWOJE UCZNIOWIE
          </button>
          <button onClick={() => changeComponentHandler(true)}>
            DODAĆ NOWEGO UCZNIA
          </button>
        </div>
        <hr />
        {isNewStudentComponent ? (
          <AddNewStudent
            openCloseHandler={props.openCloseHandler}
            onStudentAdd={props.onStudentAdd}
          />
        ) : (
          sectionOne
        )}
      </section>
    </Card>
  );
};

export default AddExistingStudent;
