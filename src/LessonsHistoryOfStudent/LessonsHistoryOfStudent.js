import { useState } from "react/cjs/react.development";
import classes from "./LessonsHistoryOfStudent.module.scss";
import YearHistory from "./YearHistory/YearHistory";

const LessonsHistoryOfStudent = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const combinedClassesArrow = isOpen
    ? [classes.handler, classes.firstSection, classes.isCloseArrow]
    : [classes.handler, classes.firstSection, classes.isOpenArrow];
  const secondCombinedClasses = isOpen
    ? [classes.secondSection, classes.isClose]
    : [classes.secondSection, classes.isOpen];

  const openCloseHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={classes.main}>
      <div className={classes.firstSection} onClick={openCloseHandler}>
        <h5>Historja Ucznia</h5>
        <div className={combinedClassesArrow.join(" ")}>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className={secondCombinedClasses.join(" ")}>
        {Object.keys(props.lessonsHistory).map((year) => {
          return (
            <YearHistory
              key={year}
              year={year}
              months={props.lessonsHistory[year]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LessonsHistoryOfStudent;
