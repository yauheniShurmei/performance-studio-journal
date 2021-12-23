import React from "react";
import { useState } from "react";

const AuthContext = React.createContext({
  studentsFromCurrentYear: [],
  token: "",
  localId: "",
  isLoggedIn: false,
  getLocalIdHandler: (localId) => {},
  login: (token) => {},
  logout: () => {},
  currentMonth: "",
  currentYear: "",
  resetDate: () => {},
  deleteStudentHandler: () => {},
});

export const AuthContextProvider = (props) => {
  // console.log("[STORE CONTEXT_API]");
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const initialLocalId = localStorage.getItem("localId");
  const [localId, setLocalId] = useState(initialLocalId);
  const [studentsFromCurrentYear, setStudentsFromCurrentYear] = useState([]);
  const userIsLoggedIn = !!token;
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(
    new Date().getMonth() > 8
      ? new Date().getMonth() + 1
      : `0${new Date().getMonth() + 1}`
  );

  const getLocalIdHandler = (localId) => {
    setLocalId(localId);
    localStorage.setItem("localId", localId);
  };

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.clear();
  };

  const getStudentsFromCurrentYearHandler = (students) => {
    setStudentsFromCurrentYear(students);
  };

  const setYearFunction = (year) => {
    setYear(year);
  };
  const setMonthFunction = (month) => {
    setMonth(month);
  };

  const resetDate = () => {
    setMonth(
      new Date().getMonth() > 8
        ? new Date().getMonth() + 1
        : `0${new Date().getMonth() + 1}`
    );
    setYear(new Date().getFullYear());
  };

  // -------------DELETE STUDENT HANDLER --------------------------------
  const deleteStudentHandler = (key, dataIsChange, openCloseHandler) => {
    console.log("TA DAAAA", key);
    let isDeleteEntireStudentOrOneMonthData;
    if (Object.entries(studentsFromCurrentYear[key].lessons).length < 2) {
      isDeleteEntireStudentOrOneMonthData = `https://performance-lessons-default-rtdb.firebaseio.com/users/${localId}/work_years/${year}/${key}.json`;
    } else {
      isDeleteEntireStudentOrOneMonthData = `https://performance-lessons-default-rtdb.firebaseio.com/users/${localId}/work_years/${year}/${key}/lessons/${month}.json`;
    }
    fetch(isDeleteEntireStudentOrOneMonthData, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        openCloseHandler();
        dataIsChange();
        // console.log(data);
      })
      .catch((err) => {
        // console.log(err);
      });
  };
  // -------------DELETE STUDENT HANDLER --------------------------------

  const contextValue = {
    token: token,
    localId: localId,
    isLoggedIn: userIsLoggedIn,
    getLocalId: getLocalIdHandler,
    login: loginHandler,
    logout: logoutHandler,
    studentsFromCurrentYear: studentsFromCurrentYear,
    getStudents: getStudentsFromCurrentYearHandler,
    currentMonth: month,
    currentYear: year,
    setYearFunction: setYearFunction,
    setMonthFunction: setMonthFunction,
    resetDate: resetDate,
    deleteStudentHandler: deleteStudentHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
