import classes from "./Table.module.scss";
import { useEffect, useState } from "react";
import { MONTHS, YEARS } from "./DATE";
import AddStudent from "../AddStudent/AddStudent";
import Students from "../Students/Students";
import StudentInfoPage from "../StudentInfoPage/StudentInfoPage";
import { useContext } from "react/cjs/react.development";
import AuthContext from "../store/auth-context";
import { useNavigate } from "react-router-dom";
import ConfirmWindow from "../ConfirmWindow/ConfirmWindow";
import useEscape from "../hooks/escape-hook";

const Table = (props) => {
  // console.log("[TABLE_COPY.JS]");
  const [data, setData] = useState();
  const [isOpenStudentInfo, setIsOpenStudentInfo] = useState(false);
  const [isOpenConfirmedWindow, setIsOpenConfirmedWindow] = useState(false);
  const [selectedStudentForChange, setSelectedStudentForChange] = useState();
  const [sumaLekcji, setSumaLekcji] = useState([0, 0]);
  const [isAddFromLastMonth, setIsAddFromLastMonth] = useState(false);
  const [studentToDeleteInformation, setStudentToDeleteInformation] =
    useState();
  const [
    isShowButtonAddStudentFromLastMonth,
    setIsShowButtonAddStudentFromLastMonth,
  ] = useState(false);
  const [previewMonthStudents, setPreviewMonthStudents] = useState([]);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEscape(() => {
    setIsOpenConfirmedWindow(false);
    setIsOpenStudentInfo(false);
  });

  const changeMonthHandler = (event) => {
    authCtx.setMonthFunction(event.target.value);
  };
  const changeYearHandler = (event) => {
    authCtx.setYearFunction(event.target.value);
  };

  async function findStudentFromSelectedMonth(month, year) {
    const returnData = {};
    await fetch(
      `https://performance-lessons-default-rtdb.firebaseio.com/users/${authCtx.localId}/work_years/${year}.json`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let error = "Something is wrong!";
            throw new Error(error);
          });
        }
      })
      // ------------------------- DO IF DATA IS -------------------------
      .then((data) => {
        if (data) {
          const dataArray = Object.keys(data).map((key) => {
            data[key].student_profile.key = key;
            data[key].year = String(year);
            return data[key];
          });
          //--------------szukamy studentów z wybranogo miesiąca-------------------
          const filteredStudents = [];
          dataArray.map((student) => {
            if (typeof student.lessons[month] != "undefined") {
              filteredStudents.push(student);
            }
            return null;
          });
          returnData.students = filteredStudents;
        } else {
          return null;
        }
      })
      // ------------------------- DO IF DATA IS -------------------------END
      // -------------------------Catch the Err if NO DATA -------------------------
      .catch((err) => {
        // console.log("[IS NO DATA]");
        alert(err.message);
      });
    // -------------------------Catch the Err if NO DATA -------------------------END
    return returnData;
  }

  // ----------------------- MAIN FUNCTION GET STUDENTS -----------------------
  const getDataFromServer = () => {
    // console.log("[TABLE][FUNC] GET_DATA_FROM_SERVER");
    fetch(
      `https://performance-lessons-default-rtdb.firebaseio.com/users/${authCtx.localId}/work_years/${authCtx.currentYear}.json`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let error = "Something is wrong!";
            throw new Error(error);
          });
        }
      })
      // ------------------------- DO IF DATA IS -------------------------
      .then((data) => {
        // console.log("[DATA IS]");

        if (data) {
          const dataArray = Object.keys(data).map((key) => {
            data[key].student_profile.key = key;
            data[key].year = String(authCtx.currentYear);
            return data[key];
          });
          authCtx.getStudents(data);
          //--------------szukamy studentów z wybranogo miesiąca-------------------
          const filteredStudents = [];
          let sumaLekcji = [0, 0];
          dataArray.map((student) => {
            if (typeof student.lessons[authCtx.currentMonth] != "undefined") {
              let filteredStudent = {};
              filteredStudent.key = student.student_profile.key;
              filteredStudent.name = student.student_profile.name;
              filteredStudent.familyName = student.student_profile.familyName;
              filteredStudent.lessonDuration =
                student.student_profile.lessonDuration;
              filteredStudent.lessons = student.lessons[authCtx.currentMonth];
              // -------liczymy sume lekcji--------------------------------
              const sumOf35MinutLesson = student.lessons[
                authCtx.currentMonth
              ].reduce((prev, curr) => {
                return curr !== 0 &&
                  curr !== "-" &&
                  Number(student.student_profile.lessonDuration) === 30
                  ? prev + 1
                  : prev + 0;
              }, 0);
              const sumOf45MinutLesson = student.lessons[
                authCtx.currentMonth
              ].reduce((prev, curr) => {
                return curr !== 0 &&
                  curr !== "-" &&
                  Number(student.student_profile.lessonDuration) === 45
                  ? prev + 1
                  : prev + 0;
              }, 0);
              sumaLekcji[0] += sumOf35MinutLesson;
              sumaLekcji[1] += sumOf45MinutLesson;
              // ------------------liczymy sume lekcji-------------------
              if (
                typeof student.lessons[
                  Number(authCtx.currentMonth) < 11
                    ? `0${Number(authCtx.currentMonth) - 1}`
                    : Number(authCtx.currentMonth) - 1
                ] != "undefined"
              ) {
                filteredStudent.leftFromLastMonth = student.lessons[
                  Number(authCtx.currentMonth) < 11
                    ? `0${Number(authCtx.currentMonth) - 1}`
                    : Number(authCtx.currentMonth) - 1
                ].reduce((prev, curr) => {
                  return curr !== 0 && prev - 1 >= 0 ? prev - 1 : prev - 0;
                }, 4);
              }
              filteredStudents.push(filteredStudent);
            }
            return null;
          });
          if (filteredStudents.length !== 0) {
            setData(filteredStudents);
          } else {
            setData(0);
          }
          setSumaLekcji(sumaLekcji);
          checkLastMonthAndShowTheButton();
        } else {
          checkLastMonthAndShowTheButton();
          authCtx.getStudents({});
          setData(0);
        }
      })
      // -------------------------DO IF DATA IS END -------------------------
      // -------------------------Catch the Err if NO DATA -------------------------
      .catch((err) => {
        alert(err.message);
      });
    // -------------------------Catch the Err if NO DATA END-------------------------
  };
  // ----------------------- MAIN FUNCTION GET STUDENTS -----------------------
  useEffect(() => {
    // console.log("[USE EFFECT IN TABLE] [GET DATA FROM SERVER FUNC]");
    getDataFromServer();
  }, [authCtx.currentMonth, authCtx.currentYear, isAddFromLastMonth]);

  const openAndChangeStudentInfoHandler = (student) => {
    setIsOpenStudentInfo(!isOpenStudentInfo);
    setSelectedStudentForChange(student);
  };

  const openCloseInfoPageHandler = () => {
    setIsOpenStudentInfo(!isOpenStudentInfo);
  };
  const openCloseConfirmedWindow = (studentInfoObj) => {
    setIsOpenConfirmedWindow(!isOpenConfirmedWindow);
    setStudentToDeleteInformation(studentInfoObj);
  };

  const salaryCounter = () => {
    return sumaLekcji[0] * 20 + sumaLekcji[1] * 40;
  };
  // -----------------addStudent----------------- //
  async function addStudentHandler(students) {
    // console.log("[addStudentHandler FUNCTION]");

    for (let student of students) {
      let lessons = {};
      if (
        authCtx.studentsFromCurrentYear &&
        authCtx.studentsFromCurrentYear[student.student_profile.key] &&
        authCtx.studentsFromCurrentYear[student.student_profile.key].lessons
      ) {
        lessons =
          authCtx.studentsFromCurrentYear[student.student_profile.key].lessons;
      }
      const newStudent = {
        lessons: lessons,
        student_profile: student.student_profile,
      };
      newStudent.lessons[authCtx.currentMonth] = [0, 0, 0, 0, 0, 0, 0, 0];
      console.log(newStudent);

      await fetch(
        `https://performance-lessons-default-rtdb.firebaseio.com/users/${authCtx.localId}/work_years/${authCtx.currentYear}/${student.student_profile.key}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStudent),
        }
      )
        .then((response) => response.json())
        .then((data) => {})
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
  // -----------------addStudent-----------------

  // --------------------------- FUNCTION CHECK LAST MONTH AN SHOW THE BUTTON? ---------------------------
  function checkLastMonthAndShowTheButton() {
    let searchingMonth;
    let searchingYear;
    if (Number(authCtx.currentMonth) === 1) {
      searchingMonth = 12;
      searchingYear = Number(authCtx.currentYear) - 1;
    } else {
      searchingMonth = Number(authCtx.currentMonth) - 1;
      searchingYear = authCtx.currentYear;
    }

    if (searchingMonth < 10) {
      searchingMonth = `0${searchingMonth}`;
    }

    let students = [];
    findStudentFromSelectedMonth(searchingMonth, searchingYear).then((res) => {
      if (res.students) {
        students = [...res.students];
        console.log(students);
        setPreviewMonthStudents(students);
        setIsShowButtonAddStudentFromLastMonth(true);
      } else {
        setPreviewMonthStudents([]);
        setIsShowButtonAddStudentFromLastMonth(false);
      }
    });
  }
  // --------------------------- FUNCTION CHECK LAST MONTH AN SHOW THE BUTTON? END ---------------------------
  // --------------------------- FINDING PREVIEW MONTH ---------------------------
  const addStudentsFromPreviewMonth = () => {
    let searchingMonth;
    let searchingYear;
    if (Number(authCtx.currentMonth) === 1) {
      searchingMonth = 12;
      searchingYear = Number(authCtx.currentYear) - 1;
    } else {
      searchingMonth = Number(authCtx.currentMonth) - 1;
      searchingYear = authCtx.currentYear;
    }

    if (searchingMonth < 10) {
      searchingMonth = `0${searchingMonth}`;
    }

    let students = [];
    findStudentFromSelectedMonth(searchingMonth, searchingYear)
      .then((res) => {
        students = [...res.students];
        console.log(students);
        addStudentHandler(students).then((res) =>
          setIsAddFromLastMonth(!isAddFromLastMonth)
        );
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  };
  // --------------------------- FINDING PREVIEW MONTH END---------------------------
  // --------------------------- CHANGE DATE BY ARROW FUNCTION---------------------------
  const changeDateByArrow = (way) => {
    console.log(YEARS[YEARS.length - 1].value);

    if (way === "left" && Number(authCtx.currentMonth) !== 1) {
      const newMonth =
        Number(authCtx.currentMonth) - 1 < 10
          ? `0${Number(authCtx.currentMonth) - 1}`
          : `${Number(authCtx.currentMonth) - 1}`;
      authCtx.setMonthFunction(newMonth);
    } else if (
      way === "left" &&
      Number(authCtx.currentMonth) === 1 &&
      Number(authCtx.currentYear) - 1 >= YEARS[0].value
    ) {
      const newYear = `${Number(authCtx.currentYear) - 1}`;
      authCtx.setMonthFunction("12");
      authCtx.setYearFunction(newYear);
    }

    if (way === "right" && Number(authCtx.currentMonth) !== 12) {
      const newMonth =
        Number(authCtx.currentMonth) + 1 < 10
          ? `0${Number(authCtx.currentMonth) + 1}`
          : `${Number(authCtx.currentMonth) + 1}`;
      authCtx.setMonthFunction(newMonth);
    } else if (
      way === "right" &&
      Number(authCtx.currentMonth) === 12 &&
      Number(authCtx.currentYear) + 1 <= YEARS[YEARS.length - 1].value
    ) {
      const newYear = `${Number(authCtx.currentYear) + 1}`;
      authCtx.setMonthFunction("01");
      authCtx.setYearFunction(newYear);
    }
  };
  // --------------------------- CHANGE DATE BY ARROW FUNCTION END---------------------------

  const selectElements = (
    <div className={classes.dataSection}>
      <img src="left_arrow.png" onClick={() => changeDateByArrow("left")} />
      <select
        value={authCtx.currentYear}
        id="year-select"
        onChange={changeYearHandler}
      >
        {YEARS.map((year) => {
          return (
            <option key={year.value} value={year.value}>
              {year.year}
            </option>
          );
        })}
      </select>
      <select
        value={authCtx.currentMonth}
        id="month-select"
        onChange={changeMonthHandler}
      >
        {MONTHS.map((month) => {
          return (
            <option key={month.value} value={month.value}>
              {month.month}
            </option>
          );
        })}
      </select>
      <img src="right_arrow.png" onClick={() => changeDateByArrow("right")} />
    </div>
  );

  if (data === 0) {
    return (
      <section className={classes.sectionNoData}>
        <div className={classes.mainNoData}>
          <h1>Nie ma Danych</h1>
          {selectElements}
          <AddStudent onStudentAdd={() => getDataFromServer()} />
          <div>
            <button onClick={() => navigate(0)}>Cofnij</button>
            {isShowButtonAddStudentFromLastMonth &&
              previewMonthStudents.length !== 0 && (
                <button onClick={addStudentsFromPreviewMonth}>
                  {`Możesz dodać ${previewMonthStudents.length} uczniów z zeszłego miesiąca`}
                </button>
              )}
          </div>
        </div>
      </section>
    );
  }
  // SPINER
  if (!data || typeof data == "undefined" || data.length === 0) {
    return <h1>LOADING...</h1>;
  }
  // SPINER

  return (
    <section className={classes.section}>
      <table className={classes.table_main}>
        <thead>
          <tr>
            <th colSpan={11}>PERFORMANCE STUDIO</th>
          </tr>
          <tr>
            <th>{selectElements}</th>
            <th colSpan={8}>LEKCJE</th>
            <th>DO NADRABIANIA Z ZESZŁYCH MIESĘCY</th>
            <th>LEKCJI ZOSTAŁO</th>
          </tr>
        </thead>
        <tbody>
          <Students
            students={data}
            date={[authCtx.currentMonth, authCtx.currentYear]}
            openAndChangeStudentInfoHandler={openAndChangeStudentInfoHandler}
            openCloseHandler={openCloseConfirmedWindow}
            dataIsChange={() => getDataFromServer()}
          />
        </tbody>
        <tfoot>
          <tr>
            <th>SUMA LEKCJI</th>
            <td colSpan={8}>{sumaLekcji[0] + sumaLekcji[1]}</td>
            <th>WYPŁATA</th>
            <td>{salaryCounter()}</td>
          </tr>
        </tfoot>
      </table>
      {isOpenStudentInfo && (
        <StudentInfoPage
          openCloseHandler={openCloseInfoPageHandler}
          isOpen={isOpenStudentInfo}
          selectedStudentForChange={selectedStudentForChange}
          openAndChangeStudentInfoHandler={openAndChangeStudentInfoHandler}
          dataIsChange={() => getDataFromServer()}
        />
      )}
      <AddStudent
        date={[authCtx.currentMonth, authCtx.currentYear]}
        onStudentAdd={() => getDataFromServer()}
      />
      {isOpenConfirmedWindow && (
        <ConfirmWindow
          openCloseHandler={openCloseConfirmedWindow}
          isOpen={isOpenConfirmedWindow}
          dataIsChange={() => getDataFromServer()}
          studentToDeleteInformation={studentToDeleteInformation}
        />
      )}
    </section>
  );
};

export default Table;
