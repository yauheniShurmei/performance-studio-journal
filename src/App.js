import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./HomePage/HomePage";
import Custom404 from "./pages/Custom404/Custom404";
import Login from "./Login/Login";
import Signup from "./pages/SignUp/SignUp";
import Table from "./Table/Table";
import { useContext } from "react";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {!authCtx.isLoggedIn && <Route path="/login" element={<Login />} />}
        {!authCtx.isLoggedIn && <Route path="/sign-up" element={<Signup />} />}
        {authCtx.isLoggedIn && <Route path="/table" element={<Table />} />}
        <Route path="*" element={<Custom404 />} />
      </Routes>
    </div>
  );
}

export default App;
