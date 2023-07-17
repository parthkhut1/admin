import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  questionInfo: {
    marginLeft: theme.spacing(1),
  },
  questionText: {
    lineHeight: 2,
  },
}));
const DescribeImageQuestion = ({ question }) => {
  const classes = useStyles();
  return (
    <>
      <div className="form-group row">
        <div className={`col-lg-4`}>
          <Typography variant="overline">Question type: </Typography>
          <Typography variant="button" className={classes.questionInfo}>
            {`${question?.question_name}`}{" "}
          </Typography>
        </div>
        <div className={`col-lg-4`}>
          <Typography variant="overline">Question title:</Typography>
          <Typography variant="button" className={classes.questionInfo}>
            {question?.title}{" "}
          </Typography>
        </div>
        <div className={`col-lg-4`}>
          <Typography variant="overline">Difficulty level:</Typography>
          <Typography variant="button" className={classes.questionInfo}>
            {question?.difficulty}
          </Typography>
        </div>
      </div>
      <div className="form-group row">
        <div className={`col-lg-12`}>
          <Typography variant="overline">Question Text:</Typography>
        </div>
      </div>
      <div className="form-group row">
        <div className={`col-lg-12`}>
        <div>
        <img src={Object.values(question?.question_media?.image)[0]} alt="Girl in a jacket" width="300"/>
        </div>
          <Typography variant="body1" className={classes.questionText}>
            {question?.question_data?.text}
          </Typography>
        </div>
      </div>
    </>
  );
};

export default DescribeImageQuestion;
