import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";
import { useSnackbar } from "notistack";

import {
  Input,
  Select,
  Switch,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";
import * as requestFromServer from "./../_redux/mockTestsCrud";
import EnhancedTable from "../components/QuestionTable";
import * as actions from "../_redux/mockTestsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

export default function AddQuestionsTab({ mockTestId = null }) {
  const [questionTitle, setQuestionTitle] = useState("");
  const [tag, setTag] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isFree, setIsFree] = useState("");
  const [creationDateFrom, setCreationDateFrom] = useState("");
  const [creationDateTo, setCreationDateTo] = useState("");
  const [isExamQu, setIsExamQu] = useState("");
  const [isForMock, setIsForMock] = useState("");
  const [values, setValues] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  // mockTests Redux state
  const dispatch = useDispatch();
  const { listLoading, filteredQuestions } = useSelector(
    (state) => ({
      listLoading: state.mockTests.listLoading,
      filteredQuestions: state.mockTests.filteredQuestions,
    }),
    shallowEqual
  );

  return (
    <>
      <div className="form-group row" style={{ marginTop: 30 }}>
        <div className="col-lg-12">
          <label>Search Question Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Question Title"
            disabled={tag ? true : false}
            onChange={(e) => {
              const { value } = e.target;
              setQuestionTitle(value);
            }}
          />
        </div>
      </div>
      <div className="form-group row" style={{ marginTop: 30 }}>
        <div className="col-lg-12">
          <label>Search By Tag</label>{" "}
          <span style={{ fontSize: 10, marginLeft: 20 }}>
            for searching by other filter, delete the tag
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Tag"
            onChange={(e) => {
              const { value } = e.target;
              setTag(value);
            }}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-lg-4" style={{ marginTop: "20px" }}>
          <Select
            label="Question Type"
            value={questionType}
            mandatory={false}
            disabled={tag ? true : false}
            onChange={(e) => {
              const { value } = e.target;
              setQuestionType(value);
            }}
          >
            <option value=""></option>
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
        </div>
        <div className="col-lg-4" style={{ marginTop: "20px" }}>
          <Select
            label="Question Difficulty"
            value={difficulty}
            mandatory={false}
            disabled={tag ? true : false}
            onChange={(e) => {
              const { value } = e.target;
              setDifficulty(value);
            }}
          >
            <option value=""></option>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </Select>
        </div>
        <div className="col-lg-4" style={{ marginTop: "20px" }}>
          <Select
            label="Paid or Free"
            value={isFree}
            mandatory={false}
            disabled={tag ? true : false}
            onChange={(e) => {
              const { value } = e.target;
              setIsFree(value);
            }}
          >
            <option value=""></option>
            <option value="1">Free</option>
            <option value="0">Paid</option>
          </Select>
        </div>
      </div>
      <div className="form-group row">
        <div className="col-lg-4">
          <DatePickerField
            name="creationDateFrom"
            label="Creation Date From"
            disabled={tag ? true : false}
            captionHide={true}
            dateFormat="yyyy-MM-dd"
            sendDate={(date) => {
              setCreationDateFrom(format(date, "yyyy-MM-dd"));
            }}
          />
        </div>

        <div className="col-lg-4">
          <DatePickerField
            name="creationDateTo"
            label="Creation Date To"
            disabled={tag ? true : false}
            captionHide={true}
            dateFormat="yyyy-MM-dd"
            sendDate={(date) => {
              setCreationDateTo(format(date, "yyyy-MM-dd"));
            }}
          />
        </div>
        <div className="col-lg-4">
          <label>Is Exam Question?</label>
          <Select
            name="examQu"
            mandatory={false}
            value={isExamQu}
            disabled={tag ? true : false}
            onChange={(e) => {
              const { value } = e.target;
              setIsExamQu(value);
            }}
          >
            <option value=""></option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </Select>
        </div>
      </div>
      <div className="form-group row">
        <div className="col-lg-4">
          <label>Is For Mock Test?</label>
          <Select
            name="isForMock"
            mandatory={false}
            value={isForMock}
            disabled={tag ? true : false}
            onChange={(e) => {
              const { value } = e.target;
              setIsForMock(value);
            }}
          >
            <option value=""></option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </Select>
        </div>
      </div>
      
      <div className="form-group row">
        <div className="col-lg-6">
          <button
            onClick={() => {
              const values = {
                question_title: questionTitle,
                question_type: questionType,
                difficulty,
                is_free: isFree,
                is_for_mock: isForMock,
                creationDate_from: creationDateFrom,
                creationDate_to: creationDateTo,
                isExamQu,
                tag,
                per_page: 10,
                page: 1,
              };
              setValues(values);

              dispatch(actions.fetchFilteredQuestions(values));
            }}
            className="btn btn-primary btn-elevate"
            type="button"
          >
            {listLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{ marginRight: "10px", padding: "5px" }}
              />
            ) : null}
            Apply filters
          </button>
        </div>
      </div>
      <EnhancedTable
        filterdQuestions={filteredQuestions}
        onAdd={(questions) => {
          dispatch(actions.addQuestionToMockTest(mockTestId, questions));
        }}
        filterValues={values}
      />
    </>
  );
}
