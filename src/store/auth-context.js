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
});

export const AuthContextProvider = (props) => {
  console.log("[STORE CONTEXT_API]");
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const initialLocalId = localStorage.getItem("localId");
  const [localId, setLocalId] = useState(initialLocalId);
  const [studentsFromCurrentYear, setStudentsFromCurrentYear] = useState([]);
  const userIsLoggedIn = !!token;

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

  const contextValue = {
    token: token,
    localId: localId,
    isLoggedIn: userIsLoggedIn,
    getLocalId: getLocalIdHandler,
    login: loginHandler,
    logout: logoutHandler,
    studentsFromCurrentYear: studentsFromCurrentYear,
    getStudents: getStudentsFromCurrentYearHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
