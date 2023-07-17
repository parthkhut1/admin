import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";

import SnackbarUtils from "../../../notistack";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function GenerateRandomMockTest({
  randomQuestions,
  onChange,
  onAddNewItem,
  onEditItem,
}) {
  const [item, setItem] = useState({});
  const classes = useStyles();

  return (
    <div>
      {randomQuestions.map((q, i) => (
        <div
          key={i}
          style={{
            border: "1px solid rgb(230 230 230)",
            borderRadius: "3px",
            marginBottom: 20,
          }}
        >
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="grouped-native-select">
              Question Type
            </InputLabel>
            <Select
              native
              disabled={q.isDisabled}
              name="type"
              value={q.type}
              onChange={(e) => {
                const { value } = e.target;
                const existType = randomQuestions.find((i) => i.type === value && i.difficulty == q.difficulty);
                if (existType)
                  return SnackbarUtils.error("Item already exist.");
                else onChange({ ...q, type: value });



                // onChange({ ...prev, type: value });
              }}
            >
              <optgroup label="Speaking">
                <option value="ReadAloud">Read Aloud</option>
                <option value="RepeatSentence">Repeat Sentence</option>
                <option value="DescribeImage">Describe Image</option>
                <option value="RetellLecture">Retell Lecture</option>
                <option value="AnswerShortQuestion">
                  Answer Short Question
                </option>
              </optgroup>
              <optgroup label="Writing">
                <option value="SummarizeWrittenText">
                  Summarize Written Text
                </option>
                <option value="WriteEssay">Write Essay</option>
              </optgroup>
              <optgroup label="Reading">
                <option value="ReadingMultipleChoiceSingleAnswer">
                  Multiple Choice(Single)
                </option>
                <option value="ReadingMultipleChoiceMultipleAnswer">
                  Multiple Choice(Multiple)
                </option>
                <option value="ReorderParagraph">Reorder Paragraph</option>
                <option value="ReadingFillInTheBlanks">
                  R-Fill In The Blanks
                </option>
                <option value="ReadingAndWritingFillInTheBlanks">
                  RW-Fill In The Blanks
                </option>
              </optgroup>
              <optgroup label="Listening">
                <option value="SummarizeSpokenText">
                  Summarize Spoken Text
                </option>
                <option value="ListeningMultipleChoiceSingleAnswer">
                  Multiple Choice(single)
                </option>
                <option value="ListeningMultipleChoiceMultipleAnswer">
                  Multiple Choice(multiple)
                </option>
                <option value="ListeningFillInTheBlanks">
                  Fill In The Blanks
                </option>
                <option value="HighlightCorrectSummary">
                  Highlight Correct Summary
                </option>
                <option value="SelectMissingWord">Select Missing Word</option>
                <option value="HighlightIncorrectWords">
                  Highlight Incorrect Words
                </option>
                <option value="WriteFromDictation">Write From Dictation</option>
              </optgroup>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="grouped-native-select">Difficulty</InputLabel>
            <Select
              native
              disabled={q.isDisabled}
              name="difficulty"
              value={q.difficulty}
              onChange={(e) => {
                const { value } = e.target;

                const existType = randomQuestions.find((i) => i.type === q.type && i.difficulty == value);
                if (existType)
                  return SnackbarUtils.error("Item already exist.");
                else onChange({ ...q, type: value });




                onChange({ ...q, difficulty: value });
              }}
            >

              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              label="Count"
              type="number"
              name="count"
              disabled={q.isDisabled}
              InputProps={{ inputProps: { min: 1 } }}
              value={q.count}
              onChange={(e) => {
                const { value } = e.target;
                onChange({ ...q, count: value });
              }}
            />
          </FormControl>
          <button
            className="btn btn-success btn-elevate"
            onClick={() => onEditItem(q)}
            type="button"
            style={{marginTop:10}}
          >
            {q.isDisabled ? "Edit" : "Save"}
          </button>
        </div>
      ))}

      <div
        style={{ border: "1px solid rgb(230 230 230)", borderRadius: "3px" }}
      >
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="grouped-native-select">Question Type</InputLabel>
          <Select
            native
            name="type"
            defaultValue=""
            value={item.type || ""}
            onChange={(e) => {
              const { value } = e.target;
              setItem((prev) => ({ ...prev, type: value }));
            }}
          >
            <option aria-label="None" value="" />
            <optgroup label="Speaking">
              <option value="ReadAloud">Read Aloud</option>
              <option value="RepeatSentence">Repeat Sentence</option>
              <option value="DescribeImage">Describe Image</option>
              <option value="RetellLecture">Retell Lecture</option>
              <option value="AnswerShortQuestion">Answer Short Question</option>
            </optgroup>
            <optgroup label="Writing">
              <option value="SummarizeWrittenText">
                Summarize Written Text
              </option>
              <option value="WriteEssay">Write Essay</option>
            </optgroup>
            <optgroup label="Reading">
              <option value="ReadingMultipleChoiceSingleAnswer">
                Multiple Choice(Single)
              </option>
              <option value="ReadingMultipleChoiceMultipleAnswer">
                Multiple Choice(Multiple)
              </option>
              <option value="ReorderParagraph">Reorder Paragraph</option>
              <option value="ReadingFillInTheBlanks">
                R-Fill In The Blanks
              </option>
              <option value="ReadingAndWritingFillInTheBlanks">
                RW-Fill In The Blanks
              </option>
            </optgroup>
            <optgroup label="Listening">
              <option value="SummarizeSpokenText">Summarize Spoken Text</option>
              <option value="ListeningMultipleChoiceSingleAnswer">
                Multiple Choice(single)
              </option>
              <option value="ListeningMultipleChoiceMultipleAnswer">
                Multiple Choice(multiple)
              </option>
              <option value="ListeningFillInTheBlanks">
                Fill In The Blanks
              </option>
              <option value="HighlightCorrectSummary">
                Highlight Correct Summary
              </option>
              <option value="SelectMissingWord">Select Missing Word</option>
              <option value="HighlightIncorrectWords">
                Highlight Incorrect Words
              </option>
              <option value="WriteFromDictation">Write From Dictation</option>
            </optgroup>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="grouped-native-select">Difficulty</InputLabel>
          <Select
            defaultValue=""
            native
            name="difficulty"
            value={item.difficulty || ""}
            onChange={(e) => {
              const { value } = e.target;
              setItem((prev) => ({ ...prev, difficulty: value }));
            }}
          >
            <option aria-label="None" value="" />
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            label="Count"
            type="number"
            name="count"
            value={item.count}
            InputProps={{ inputProps: { min: 1 } }}
            onChange={(e) => {
              const { value } = e.target;
              setItem((prev) => ({ ...prev, count: value }));
            }}
          />
        </FormControl>
      </div>
      <div className="form-group row" style={{ marginTop: "20px" }}>
        <div className="col-lg-2">
          <button
            onClick={() => {
              if (!item.type || !item.difficulty) {
                return SnackbarUtils.error("Select Item type & difficulty");
              } else {
                const existItem = randomQuestions.find(
                  (rq) =>
                    rq.type === item.type && rq.difficulty === item.difficulty
                );
                if (!existItem)
                  onAddNewItem({ ...item, id: Date.now(), isDisabled: true });
                else {
                  return SnackbarUtils.error("Item already exist.");
                }
                setItem({ type: "", difficulty: "",count :0 });
              }
            }}
            className="btn btn-success btn-elevate"
            type="button"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
