import { useContext, useEffect } from "react";
import { useState } from "react/cjs/react.development";
import Card from "../../Card/Card";
import AuthContext from "../../store/auth-context";
import AddNewStudent from "../AddNewStudent/AddNewStudent";
import classes from "./AddExistingStudent.module.scss";

const AddExistingStudent = (props) => {
  const authCtx = useContext(AuthContext);
  const [data, setData] = useState();
  const [selectedYear, setSelectedYear] = useState();
  const [years, setYears] = useState([]);
  const [students, setStudents] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [sortBy, setSortBy] = useState();
  const [isNewStudentComponent, setIsNewStudentComponent] = useState(false);

  console.log("COMPONENT");

  useEffect(() => {
    console.log("USE EFEECT");
    // --------------------------- Get All Years For Options---------------------------
    fetch(
      `https://performance-lessons-default-rtdb.firebaseio.com/users/${authCtx.localId}/work_years.json`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          const years = [...Object.keys(data), "all"];
          const year = [...Object.keys(data), "all"].includes(
            String(authCtx.currentYear)
          )
            ? String(authCtx.currentYear)
            : "all";
          setData(data);
          setYears(years);
          setSelectedYear(year);
          getStudents(year, years, data);
        }
      });
    // --------------------------- Get All Years For Options---------------------------
    // getStudents(selectedYear);
  }, [
    authCtx.currentYear,
    setSelectedYear,
    setYears,
    authCtx.localId,
    setData,
  ]);

  function getStudents(year, years, data) {
    const keysOfAllStudentsArray = [];
    let unitedDataObject = {};
    const searchStudents = [];

    if (year === "all") {
      for (let year of years) {
        if (year !== "all") {
          Object.keys(data[year]).map((key) => {
            keysOfAllStudentsArray.push(key);
          });
          unitedDataObject = { ...unitedDataObject, ...data[year] };
        }
      }
      const newArrayWithNoRepeatKeys = [...new Set(keysOfAllStudentsArray)];

      for (let key of newArrayWithNoRepeatKeys) {
        if (
          authCtx.studentsFromCurrentYear[key]?.lessons[authCtx.currentMonth]
        ) {
        } else if (unitedDataObject[key]) {
          unitedDataObject[key].student_profile.key = key;
          searchStudents.push(unitedDataObject[key]);
        }
      }
      if (isSorted) {
        sortHandler(sortBy, searchStudents);
        setStudents(searchStudents);
      } else {
        setStudents(searchStudents);
      }
    } else {
      Object.keys(data[year]).map((key) => {
        keysOfAllStudentsArray.push(key);
      });
      unitedDataObject = { ...data[year] };
      for (let key of keysOfAllStudentsArray) {
        if (
          authCtx.studentsFromCurrentYear[key]?.lessons[authCtx.currentMonth]
        ) {
        } else if (unitedDataObject[key]) {
          unitedDataObject[key].student_profile.key = key;
          searchStudents.push(unitedDataObject[key]);
        }
      }
      if (isSorted) {
        sortHandler(sortBy, searchStudents);
        setStudents(searchStudents);
      } else {
        setStudents(searchStudents);
      }
    }
  }

  // ---------------------switch between newStudent and ExistStudent-----------------------
  const changeComponentHandler = (e) => {
    setIsNewStudentComponent(e);
  };
  // ---------------------switch between newStudent and ExistStudent-----------------------
  // ------------------------------changeHandler------------------------------
  const changeHandler = (e) => {
    setSelectedYear(e.target.value);
    getStudents(e.target.value, years, data);
  };
  // ------------------------------END------------------------------
  // ------------------------------sortHandler------------------------------
  const changeSortHandler = (event) => {
    setSortBy(event.target.value);
    sortHandler(event.target.value, students);
  };

  const sortHandler = (event, students) => {
    console.log("Method SORTINg");
    let sortedStudents = [];
    if (event === "alfabetImie") {
      setIsSorted(true);
      sortedStudents = students.sort(function compare(a, b) {
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
    } else {
      setIsSorted(false);
    }
  };
  // ------------------------------END------------------------------
  // ------------------------------addStudentHandler------------------------------
  const addStudentHandler = (event) => {};
  // ------------------------------END------------------------------

  const sectionOne = (
    <div>
      <div>
        <select onChange={changeHandler} value={selectedYear}>
          {years.map((year) => {
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <select onChange={changeSortHandler} value={sortBy}>
          <option value={"default"}>-sortowanie-</option>
          <option value={"alfabetImie"}>alfabetycznie po imieniu</option>
        </select>
      </div>
      <div className={classes.listOfStudents}>
        <ul>
          {students.length !== 0 && students !== "undefined"
            ? students.map((student, index) => {
                return (
                  <li
                    key={student.student_profile.key}
                    onClick={() => addStudentHandler(student)}
                  >
                    {`${index + 1}. ${student.student_profile.name} ${
                      student.student_profile.familyName
                    }`}
                  </li>
                );
              })
            : "nie ma informacji"}
        </ul>
      </div>
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
