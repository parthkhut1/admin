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
const DescribeImageCorrection = ({ question, correctionData }) => {
  const classes = useStyles();
  const [questionTextToArray, setQuestionTextToArray] = useState([]);

  //textarea function
  const [textareaInputArray, setTextareaInputArray] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  //textarea function

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
  //textarea function
  useEffect(() => {
    setTextareaInputArray(question?.question_data?.text.trim().split(/\s+/));
  }, [question]);
  //textarea function

  useEffect(() => {
    setQuestionTextToArray(question?.question_data?.text?.split(" "));
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
        draft["word_pronunciation"] = level;
        draft["pauses"] = selectedWords;
      })
    );
  }, [level, selectedWords]);

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
            label="Score Pronunciation"
            name="score_pronunciation"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
        <div className={`col-lg-3`}>
          <TextField
            id="outlined-basic 2"
            type="number"
            label="Score Oral Fluency"
            name="score_oral_fluency"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
        <div className={`col-lg-3`}>
          <TextField
            id="outlined-basic 3"
            type="number"
            label="Score Content"
            name="score_content"
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


      <div className={`form-group row ${classes.questionTextInCorection}`}>
        <div className={`col-lg-12`}>
          <h6 style={{ paddingBottom: "5px" }}>
            Please click on the words that student paused on{" "}
            <span style={{ color: "red" }}> *</span>
          </h6>

          {textareaInputArray.map((wrd, index) => {
            let style = { ...baseClass };
            if (
              selectedWords.findIndex(
                (i) =>
                  i.word_pause_after === wrd &&
                  i.word_pause_after_index === index
              ) !== -1
            ) {
              style = { ...baseClass, ...selectedClass };
            }
            return (
              <p
                key={wrd + index}
                style={style}
                className={
                  selectedWords.findIndex(
                    (i) =>
                      i.word_pause_after === wrd &&
                      i.word_pause_after_index === index
                  ) !== -1
                    ? selectedClass
                    : ""
                }
                onClick={() => {
                  const existWordIndex = selectedWords.findIndex(
                    (i) =>
                      i.word_pause_after === wrd &&
                      i.word_pause_after_index === index
                  );

                  if (existWordIndex === -1) {
                    setSelectedWords((prev) => [
                      ...prev,
                      { word_pause_after: wrd, word_pause_after_index: index },
                    ]);
                  } else {
                    setSelectedWords((prev) =>
                      prev.filter(
                        (i) =>
                          i.word_pause_after !== wrd ||
                          i.word_pause_after_index !== index
                      )
                    );
                  }
                }}
              >
                {wrd}
              </p>
            );
          })}
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

export default DescribeImageCorrection;
