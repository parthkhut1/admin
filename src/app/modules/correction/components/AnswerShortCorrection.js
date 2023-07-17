import React, { useState, useEffect, useMemo } from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import produce from "immer";

const useStyles = makeStyles((theme) => ({
  questionInfo: {
    marginLeft: theme.spacing(1),
  },
  questionText: {
    lineHeight: 2,
  },
  questionTextInCorection: {
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(7),
  },
  widthForInput: {
    width: "100%",
  },
  wordsBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wordBox: {
    margin: 5,
  },
  numberInputForLevel: {
    marginLeft: theme.spacing(1),
    width: "50%",
  },
}));

const levels = [
  {
    value: "GOOD",
    label: "GOOD",
  },
  {
    value: "BAD",
    label: "BAD",
  },
  {
    value: "STRUCK",
    label: "STRUCK",
  },
  {
    value: "AVERAGE",
    label: "AVERAGE",
  },
];
const selectedClass = {
  backgroundColor: "red",
  color: "rgb(255, 255, 255)",
  padding: "2px",
  borderRadius: "4px",
  backgroundColor: "red",
};

const baseClass = {
  display: "inline-block",
  margin: "0px 2px",
  cursor: "pointer",
};
const AnswerShortCorrection = ({ question, correctionData }) => {
  const classes = useStyles();
  const [questionTextToArray, setQuestionTextToArray] = useState([]);

  //textarea function
  const [textareaInputArray, setTextareaInputArray] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  //textarea function

  const [obj, setObj] = useState({});

  const [level, setLevel] = useState([]);

  //textarea function
  useEffect(() => {
    setTextareaInputArray(question?.question_meta?.transcript.trim().split(/\s+/));
  }, [question]);
  //textarea function

  useEffect(() => {
    setQuestionTextToArray(question?.question_meta?.transcript?.split(" "));
  }, [question]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setObj((prev) =>
      produce(prev, (draft) => {
        if (!draft) draft = {};
        draft[name] = value ? value : 1;
      })
    );
  };



  useEffect(() => {
    // console.log("OBJ", obj);
    correctionData(obj);
  }, [obj]);

  return (
    <>
      <div className="form-group row">
        <div className={`col-lg-3`}>
          <TextField
            id="outlined-basic 1"
            type="number"
            label="Score Vocabulary"
            name="score_vocabulary"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
        <div className={`col-lg-3`}>
          <TextField
            id="outlined-basic 4"
            type="number"
            label="Score Task"
            name="score_task"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
      </div>
      <div className="form-group row">
        <div className={`col-lg-5`}>
          <TextField
            step={10}
            className={`${classes.widthForInput}`}
            id="outlined-basic 5"
            type="number"
            name="score_speaking_communicative_skills"
            label="Score Speaking Communicative Skills"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
        <div className={`col-lg-5`}>
          <TextField
            className={`${classes.widthForInput}`}
            id="outlined-basic 6"
            type="number"
            label="Score Listening Communicative Skills"
            name="score_listening_communicative_skills"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
      </div>
      <div className="form-group row">
        <div className={`col-lg-5`}>
          <TextField
            className={`${classes.widthForInput}`}
            id="outlined-basic 8"
            type="number"
            label="Score Vocabulary Enabling Skills"
            name="score_vocabulary_enabling_skills"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
      </div>

    </>
  );
};

export default AnswerShortCorrection;
