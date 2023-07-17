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
    value: "WRITTEN_AND_EXIST",
    label: "WRITTEN AND EXIST",
  },
  {
    value: "MISSED",
    label: "MISSED",
  },
  {
    value: "WRITTEN_AND_DONT_EXIST",
    label: "WRITTEN AND DONT EXIST",
  },
  {
    value: "WRITTEN_AND_EXIST",
    label: "WRITTEN AND EXIST",
  },
  {
    value: "WRITTEN_AND_DONT_EXIST",
    label: "WRITTEN AND DONT EXIST",
  },
];

const WriteFromDictationCorrection = ({ question, correctionData }) => {
  const classes = useStyles();
  const [questionTextToArray, setQuestionTextToArray] = useState([]);

  const [obj, setObj] = useState({});

  const [level, setLevel] = useState([]);
  const handleChange = (event, word, index) => {
    const { value } = event.target;
    setLevel((prev) =>
      produce(prev, (draft) => {
        draft[index] = { word, pronunciation: value ? value : "GOOD" };
      })
    );
  };


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
    setObj((prev) =>
      produce(prev, (draft) => {
        if (!draft) draft = {};
        draft["word_sequence"] = level;
      })
    );
  }, [level]);

  useEffect(() => {
    // console.log("OBJ", obj);
    correctionData(obj);
  }, [obj]);

  return (
    <>
      <div className="form-group row">
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
            className={`${classes.widthForInput}`}
            id="outlined-basic 6"
            type="number"
            label="Score Listening Communicative Skills"
            name="score_listening_communicative_skills"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
        <div className={`col-lg-5`}>
          <TextField
            step={10}
            className={`${classes.widthForInput}`}
            id="outlined-basic 5"
            type="number"
            name="score_writing_communicative_skills"
            label="Score Writing Communicative Skills"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
      </div>
      <div className="form-group row">
        <div className={`col-lg-5`}>
          <TextField
            className={`${classes.widthForInput}`}
            id="outlined-basic 7"
            type="number"
            label="Score Pronunciation Enabling Skills"
            name="score_pronunciation_enabling_skills"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
        <div className={`col-lg-5`}>
          <TextField
            className={`${classes.widthForInput}`}
            id="outlined-basic 8"
            type="number"
            label="Score Oral Fluency Enabling Skills"
            name="score_oral_fluency_enabling_skills"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
      </div>
      <WordMap
        questionTextToArray={questionTextToArray}
        level={level}
        handleChange={handleChange}
      />
    </>
  );
};

const WordMap = React.memo(
  ({ questionTextToArray, level, handleChange }) => {
    const classes = useStyles();
    return (
      <div className={`form-group row ${classes.wordsBox}`}>
        {questionTextToArray?.map((wrd, index) => (
          <Word
            index={index}
            level={level[index]}
            wrd={wrd}
            handleChange={(e) => handleChange(e, wrd, index)}
          />
        ))}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.level === nextProps.level &&
    prevProps.questionTextToArray === nextProps.questionTextToArray
);

const Word = React.memo(
  ({ wrd, level, index, handleChange }) => {
    const classes = useStyles();
    return (
      <div key={index} className={`col-lg-5 ${classes.wordBox}`}>
        <TextField
          disabled
          id={`standard-disabled ${index}${wrd}`}
          label="Word"
          value={wrd}
        />
        <TextField
          id={`outlined-select-level${wrd}${index}`}
          select
          label="Level"
          value={level}
          className={classes.numberInputForLevel}
          onChange={handleChange}
          variant="outlined"
        >
          {levels.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.level === nextProps.level
);

export default WriteFromDictationCorrection;
