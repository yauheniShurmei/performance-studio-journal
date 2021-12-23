import classes from "./SignUp.module.scss";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../../hooks/use-input";
import { useState } from "react";
import { createNewProfile } from "../../firebase/initFireBase";
import { useContext, useRef } from "react/cjs/react.development";
import AuthContext from "../../store/auth-context";

const emailFunc = (value) => value.includes("@");
const passwordFunc = (value) => value.trim() !== "";

const Signup = () => {
  const {
    value: emailValue,
    // isValid: emailIsValid,
    // hasError: emailHasError,
    // loadedNameHandler: loadedEmailHandler,
    valueChangeHandler: emailChangeHandler,
    // inputBlurHandler: emailBlurHandler,
    // resetTouch: emailResetTouch,
    // resetAll: emailResetAll,
  } = useInput(emailFunc);

  const {
    value: passwordValue,
    // isValid: passwordIsValid,
    // hasError: passwordHasError,
    // loadedNameHandler: loadedPasswordHandler,
    valueChangeHandler: passwordChangeHandler,
    // inputBlurHandler: passwordBlurHandler,
    // resetTouch: passwordResetTouch,
    // resetAll: passwordResetAll,
  } = useInput(passwordFunc);

  const name = useRef();
  const familyName = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const formSubmitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCtgYKaQOmH8iVaIbJsasvieb_kgTCjZfA",
      {
        method: "POST",
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          res.json().then((data) => {
            let errorMessage = "authentification failed!";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            alert(errorMessage);
          });
        }
      })
      .then((data) => {
        // console.log(data.idToken);
        createNewProfile(
          data.localId,
          name.current.value,
          familyName.current.value,
          data.email
        );
        authCtx.login(data.idToken);
        authCtx.getLocalId(data.localId);
        navigate("/table");
      });
    //   .then((e) => {
    //     navigate("/table");
    //   });
  };
  return (
    <section className={classes.section}>
      <main>
        <h1>Rejestracja</h1>
        <form onSubmit={formSubmitHandler}>
          <label>Imie</label>
          <input placeholder="imie" ref={name} required />
          <label>Nazwisko</label>
          <input placeholder="nazwisko" ref={familyName} required />
          <label>Email</label>
          <input onChange={emailChangeHandler} placeholder="email" />
          <label>Hasło</label>
          <input onChange={passwordChangeHandler} placeholder="hasło" />
          <label>Powtórz hasło</label>
          <input placeholder="hasło" />
          {!isLoading && <button type="submit">Rejestracja</button>}
          {isLoading && <span>Sending request...</span>}
          <p>
            Jesli masz już profil to się{" "}
            <Link to="/login">
              <b>zaloguj</b>
            </Link>
          </p>
        </form>
      </main>
    </section>
  );
};

export default Signup;
