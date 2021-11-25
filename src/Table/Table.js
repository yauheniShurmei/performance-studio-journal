import classes from "./Table.module.scss";
import { useEffect, useState } from "react";
import { MONTHS, YEARS } from "./DATE";
import AddStudent from "../AddStudent/AddStudent";
import Students from "../Students/Students";
import StudentInfoPage from "../StudentInfoPage/StudentInfoPage";
import { useContext } from "react/cjs/react.development";
import AuthContext from "../store/auth-context";
import { Link, useNavigate } from "react-router-dom";

const Table = (props) => {
  console.log("[TABLE_COPY.JS]");

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(
    new Date().getMonth() > 8
      ? new Date().getMonth() + 1
      : `0${new Date().getMonth() + 1}`
  );
  const [data, setData] = useState();
  const [isOpenStudentInfo, setIsOpenStudentInfo] = useState(false);
  const [selectedStudentForChange, setSelectedStudentForChange] = useState();
  const [sumaLekcji, setSumaLekcji] = useState([0, 0]);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const changeMonthHandler = (event) => {
    setMonth(event.target.value);
  };
  const changeYearHandler = (event) => {
    setYear(event.target.value);
  };

  function getDataFromServer() {
    console.log("[TABLE][FUNC] GET_DATA_FROM_SERVER");
    fetch(
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
        console.log("[DATA IS]");

        if (data) {
          const dataArray = Object.keys(data).map((key) => {
            data[key].student_profile.key = key;
            return data[key];
          });
          authCtx.getStudents(data);
          //--------------szukamy studentów z wybranogo miesiąca-------------------
          const filteredStudents = [];
          let sumaLekcji = [0, 0];
          dataArray.map((student) => {
            if (typeof student.lessons[month] != "undefined") {
              let filteredStudent = {};
              filteredStudent.key = student.student_profile.key;
              filteredStudent.name = student.student_profile.name;
              filteredStudent.familyName = student.student_profile.familyName;
              filteredStudent.lessonDuration =
                student.student_profile.lessonDuration;
              filteredStudent.lessons = student.lessons[month];
              // -------liczymy sume lekcji--------------------------------
              const sumOf35MinutLesson = student.lessons[month].reduce(
                (prev, curr) => {
                  return curr !== 0 &&
                    curr !== "-" &&
                    student.student_profile.lessonDuration === 30
                    ? prev + 1
                    : prev + 0;
                },
                0
              );
              const sumOf45MinutLesson = student.lessons[month].reduce(
                (prev, curr) => {
                  return curr !== 0 &&
                    curr !== "-" &&
                    student.student_profile.lessonDuration === 45
                    ? prev + 1
                    : prev + 0;
                },
                0
              );
              sumaLekcji[0] += sumOf35MinutLesson;
              sumaLekcji[1] += sumOf45MinutLesson;
              // ------------------liczymy sume lekcji-------------------
              if (
                typeof student.lessons[
                  Number(month) < 11
                    ? `0${Number(month) - 1}`
                    : Number(month) - 1
                ] != "undefined"
              ) {
                filteredStudent.leftFromLastMonth = student.lessons[
                  Number(month) < 11
                    ? `0${Number(month) - 1}`
                    : Number(month) - 1
                ].reduce((prev, curr) => {
                  return curr !== 0 && prev - 1 >= 0 ? prev - 1 : prev - 0;
                }, 4);
              }
              filteredStudents.push(filteredStudent);
            }
          });
          if (filteredStudents.length !== 0) {
            setData(filteredStudents);
          } else {
            setData(0);
          }
          setSumaLekcji(sumaLekcji);
        } else {
          setData(0);
        }
      })
      // -------------------------DO IF DATA IS -------------------------
      // -------------------------Catch the Err if NO DATA -------------------------
      .catch((err) => {
        console.log("[IS NO DATA]");
        alert(err.message);
      });
    // -------------------------Catch the Err if NO DATA -------------------------
  }
  useEffect(() => {
    console.log("[USE EFFECT IN TABLE] [GET DATA FROM SERVER FUNC]");
    getDataFromServer();
  }, [month, year]);

  const openAndChangeStudentInfoHandler = (student) => {
    setIsOpenStudentInfo(!isOpenStudentInfo);
    setSelectedStudentForChange(student);
  };

  const openCloseInfoPageHandler = () => {
    setIsOpenStudentInfo(!isOpenStudentInfo);
  };

  const salaryCounter = () => {
    return sumaLekcji[0] * 20 + sumaLekcji[1] * 35;
  };

  if (data === 0) {
    return (
      <div>
        <h1>Nie ma Danych</h1>
        <button onClick={() => navigate(0)}>Cofnij</button>
        <Link to="/new-student">Dodaj Nowego Ucznia</Link>
      </div>
    );
  }
  if (!data || typeof data == "undefined" || data.length === 0) {
    return <h1>LOADING...</h1>;
  }

  return (
    <section className={classes.section}>
      <table className={classes.table_main}>
        <thead>
          <tr>
            <th colSpan={11}>PERFORMANCE STUDIO</th>
          </tr>
          <tr>
            <th>
              <select
                value={year}
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
                value={month}
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
            </th>

            <th colSpan={8}>LEKCJE</th>
            <th>DO NADRABIANIA Z ZESZŁYCH MIESĘCY</th>
            <th>LEKCJI ZOSTAŁO</th>
          </tr>
        </thead>
        <tbody>
          <Students
            students={data}
            date={[month, year]}
            openAndChangeStudentInfoHandler={openAndChangeStudentInfoHandler}
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
      <StudentInfoPage
        openCloseHandler={openCloseInfoPageHandler}
        isOpen={isOpenStudentInfo}
        selectedStudentForChange={selectedStudentForChange}
        openAndChangeStudentInfoHandler={openAndChangeStudentInfoHandler}
        dataIsChange={() => getDataFromServer()}
      />
      <AddStudent
        date={[month, year]}
        onStudentAdd={() => getDataFromServer()}
      />
    </section>
  );
};

export default Table;
