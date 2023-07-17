import React, { useState, useEffect, useMemo } from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CreatableSelect from "react-select";
import MenuItem from "@material-ui/core/MenuItem";
import produce from "immer";
import { Header } from "../../../../_metronic/layout/components/header/Header";

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
  inputContainer: {
    display: "flex",
    alignItems: "center",
  },
  inputBox: {
    height: 38,
    width: 200,
  },
  inputLabel: {
    position: "absolute",
    top: -8,
  },
}));

const levels = [
  {
    value: "GRAMMAR",
    label: "GRAMMAR",
  },
  {
    value: "SPELLING_GRAMMAR",
    label: "SPELLING GRAMMAR",
  },
  {
    value: "SPELLING",
    label: "SPELLING",
  },
];

const SummarizeSpokenTextCorrection = ({ question, correctionData }) => {
  const classes = useStyles();
  const [obj, setObj] = useState({});
  const [keywords, setKeywords] = useState({});

  //textarea function
  const [textareaInputArray, setTextareaInputArray] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [mistakeType, setMistakeType] = useState("GRAMMER");
  //textarea function
  //textarea function
  useEffect(() => {
    setTextareaInputArray(question?.question_data?.text.trim().split(/\s+/));
  }, [question]);

  //textarea function

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
        draft["word_mistakes"] = Object.keys(keywords).map((key) => ({
          word: [keywords[key][0].value],
          suggestion: keywords[key].slice(1).map((wrd) => wrd.value),
          type: keywords[key][0].type,
          word_index: [parseInt(key)],
        }));
      })
    );
  }, [keywords]);

  useEffect(() => {
    // console.log("OBJ", obj);
    correctionData(obj);
  }, [obj]);

  //   useEffect(() => {
  //     console.log("keywords", keywords);
  //   }, [keywords]);

  return (
    <>
      <div className="form-group row">
        <div className={`col-lg-3`}>
          <TextField
            id="outlined-basic 1"
            type="number"
            label="Score Form"
            name="score_form"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
        <div className={`col-lg-3`}>
          <TextField
            id="outlined-basic 2"
            type="number"
            label="Score Content"
            name="score_content"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
        <div className={`col-lg-3`}>
          <TextField
            id="outlined-basic 3"
            type="number"
            label="Score Grammar"
            name="score_grammar"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
      </div>
      <div className="form-group row">
        <div className={`col-lg-3`}>
          <TextField
            id="outlined-basic 4"
            type="number"
            label="Score Spelling"
            name="score_spelling"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
        <div className={`col-lg-3`}>
          <TextField
            id="outlined-basic 5"
            type="number"
            label="Score Vocabulary"
            name="score_vocabulary"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
        <div className={`col-lg-3`}>
          <TextField
            id="outlined-basic 6"
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
            id="outlined-basic 7"
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
            id="outlined-basic 8"
            type="number"
            name="Score Writing Communicative Skills"
            label="score_writing_communicative_skills"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
      </div>
      <div className="form-group row">
        <div className={`col-lg-5`}>
          <TextField
            className={`${classes.widthForInput}`}
            id="outlined-basic 9"
            type="number"
            label="Score Vocabulary Enabling Skills"
            name="score_vocabulary_enabling_skills"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
        <div className={`col-lg-5`}>
          <TextField
            className={`${classes.widthForInput}`}
            id="outlined-basic 10"
            type="number"
            label="Score Grammar Enabling Skills"
            name="score_grammar_enabling_skills"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
      </div>
      <div className="form-group row">
        <div className={`col-lg-5`}>
          <TextField
            className={`${classes.widthForInput}`}
            id="outlined-basic 11"
            type="number"
            label="Score Spelling Enabling Skills"
            name="score_spelling_enabling_skills"
            onChange={onInputChange}
            variant="outlined"
          />
        </div>
      </div>

      <div className="form-group row">
        <div className={`col-lg-8`}>
          <div>
            <h6 style={{ paddingBottom: "5px" }}>
              Please click on the words you want correct it :
              <span style={{ color: "red" }}> *</span>
            </h6>

            {textareaInputArray.map((wrd, index) => {
              let style = { ...baseClass };
              if (
                selectedWords.findIndex(
                  (i) => i.wrd === wrd && i.index === index
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
                      (i) => i.wrd === wrd && i.index === index
                    ) !== -1
                      ? selectedClass
                      : ""
                  }
                  onClick={() => {
                    const existWordIndex = selectedWords.findIndex(
                      (i) => i.wrd === wrd && i.index === index
                    );

                    if (existWordIndex === -1) {
                      setSelectedWords((prev) => [...prev, { wrd, index }]);
                      setKeywords((prev) => {
                        const newKeywords = { ...prev };
                        newKeywords[index] = [
                          {
                            label: wrd,
                            value: wrd,
                            isFixed: true,
                            type: mistakeType,
                          },
                        ];
                        return newKeywords;
                      });
                    } else {
                      setSelectedWords((prev) =>
                        prev.filter((i) => i.wrd !== wrd || i.index !== index)
                      );
                      setKeywords((prev) => {
                        const newKeywords = { ...prev };
                        delete newKeywords[index];
                        return newKeywords;
                      });
                    }
                  }}
                >
                  {wrd}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      <div className="form-group row">
        <div className={`col-lg-12`}>
          {selectedWords.length > 0
            ? selectedWords.map((sw) => (
                <div className="form-group row">
                  <div className={`col-lg-8`}>
                    <BlankOptions
                      key={sw.wrd + sw.index}
                      word={sw}
                      keywords={keywords[sw.index]}
                      setKeywords={(keywords) => {
                        setKeywords((prev) => {
                          const newKeywords = { ...prev };
                          newKeywords[sw.index] = [...keywords];
                          return newKeywords;
                        });
                      }}
                    />
                  </div>
                  <div className={`col-lg-4 ${classes.inputContainer}`}>
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="Select"
                      value={keywords[sw.index][0].type}
                      onChange={(e) => {
                        const { value } = e.target;

                        setMistakeType(value);
                        setKeywords((prev) => {
                          const newKeywords = { ...prev };
                          newKeywords[sw.index][0].type = value;
                          return newKeywords;
                        });
                      }}
                      variant="outlined"
                      InputProps={{
                        className: classes.inputBox,
                      }}
                    >
                      {levels.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
};

const BlankOptions = ({ word, keywords, setKeywords }) => {
  // keywords inputs functions

  const [inputKeywords, setInputKeywords] = useState("");

  const classes = useStyles();

  const handleChange = (value, { removedValue }) => {
    if (removedValue && removedValue.isFixed) return;
    if (value === null) setKeywords([]);
    else setKeywords(value);
  };

  const handleInputChange = (inputValue) => {
    setInputKeywords(inputValue);
  };

  const createOption = (label) => ({
    label,
    value: label,
    isFixed: false,
  });

  const handleKeyDown = (event) => {
    if (!inputKeywords) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setInputKeywords("");
        if (keywords) {
          if (keywords.findIndex((kw) => kw.value === inputKeywords) !== -1)
            return;
          setKeywords([...keywords, createOption(inputKeywords)]);
        } else setKeywords(createOption(inputKeywords));
        // setKeywords(inputKeywords);
        event.preventDefault();
    }
  };

  const styles = {
    multiValue: (base, state) => {
      return state.data.isFixed
        ? { ...base, backgroundColor: "red", color: "#fff" }
        : base;
    },
    multiValueLabel: (base, state) => {
      return state.data.isFixed
        ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
        : base;
    },
    multiValueRemove: (base, state) => {
      return state.data.isFixed ? { ...base, display: "none" } : base;
    },
  };

  // keywords inputs functions

  return (
    <div className="form-group row">
      <div className="col-lg-12">
        <div style={{ paddingBottom: "5px" }}>
          Add <span style={{ fontWeight: "bold" }}>{word.wrd}</span> options:{" "}
          <span style={{ color: "red" }}> *</span>
        </div>
        <CreatableSelect
          inputValue={inputKeywords}
          components={{ DropdownIndicator: null }}
          isClearable={false}
          isMulti
          styles={styles}
          menuIsOpen={false}
          onChange={handleChange}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type suggested words..."
          value={keywords}
        />
      </div>
    </div>
  );
};

export default SummarizeSpokenTextCorrection;
