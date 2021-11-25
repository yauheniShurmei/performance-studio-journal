import { useState } from "react";

const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && isTouched;

  const loadedNameHandler = (loadedName) => {
    setEnteredValue(loadedName);
  };
  const valueChangeHandler = (event) => {
    setEnteredValue(event.target.value);
  };
  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const resetTouch = () => {
    setIsTouched(false);
  };

  const resetAll = () => {
    setIsTouched(false);
    setEnteredValue("");
  };

  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError,
    loadedNameHandler,
    valueChangeHandler,
    inputBlurHandler,
    resetTouch,
    resetAll,
  };
};

export default useInput;
