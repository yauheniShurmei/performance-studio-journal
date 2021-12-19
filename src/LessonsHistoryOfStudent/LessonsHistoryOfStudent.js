import classes from "./LessonsHistoryOfStudent.module.scss";
import YearHistory from "./YearHistory/YearHistory";

const LessonsHistoryOfStudent = (props) => {
  // props.lessonsHistory = {2020: ["01", "02"]};
  return (
    <div className={classes.main}>
      <h5>Historja Ucznia</h5>
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
  );
};

export default LessonsHistoryOfStudent;
