import classes from "./YearHistory.module.scss";
import { MONTHS } from "../../Table/DATE";

const YearHistory = (props) => {
  console.log(MONTHS);
  return (
    <div className={classes.main}>
      <div>{props.year}</div>
      <ul>
        {MONTHS.map((month) => {
          console.log(month);
          return (
            <li
              key={month.value}
              style={
                props.months.includes(month.value)
                  ? { backgroundColor: "#e0bf04" }
                  : null
              }
            ></li>
          );
        })}
      </ul>
    </div>
  );
};

export default YearHistory;
