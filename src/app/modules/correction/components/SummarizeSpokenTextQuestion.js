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
const SummarizeSpokenTextQuestion = ({ question }) => {
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
        <div className="col-lg-12">
          {/* <audio controls controlsList="nodownload"> */}
          {question?.question_media?.audio && (
            <audio controls>
              <source src={Object.values(question?.question_media?.audio)[0]} type="audio/ogg" />
              <source src={Object.values(question?.question_media?.audio)[0]} type="audio/mpeg" />
              <source src={Object.values(question?.question_media?.audio)[0]} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          )}
          {/* <a
                        style={{
                          position: "absolute",
                          top: 36,
                          cursor: "pointer",
                        }}
                        onClick={()=>download("This is the content",`${values.answer.answer}`)}
                      >
                        <GetAppIcon fontSize="large" />
                      </a> */}
        </div>
      </div>
      <div className="form-group row">
        <div className={`col-lg-12`}>
          <Typography variant="body1" className={classes.questionText}>
            {question?.question_data?.text}
          </Typography>
        </div>
      </div>
    </>
  );
};

export default SummarizeSpokenTextQuestion;
