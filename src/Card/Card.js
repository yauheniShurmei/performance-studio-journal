import classes from "./Card.module.scss";

const Card = (props) => {
  return (
    <div>
      {props.isOpen && (
        <div className={classes.backdrop} onClick={props.openCloseHandler} />
      )}
      <div
        className={
          props.isOpen
            ? [classes.main, classes.open].join(" ")
            : [classes.main, classes.close].join(" ")
        }
      >
        {props.children}
      </div>
    </div>
  );
};
export default Card;
