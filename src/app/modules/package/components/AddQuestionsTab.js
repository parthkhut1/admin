import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import SnackbarUtils from "./../../../notistack";
import { Formik, Form, Field } from "formik";
import Alert from "@material-ui/lab/Alert";


import {
  Input,
  Select,
  Switch,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";
import QuestionTable from "../components/QuestionTable";
import * as actions from "../_redux/packagesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SelectInput from "react-select";
import { difference } from "lodash";
import { mergeFunctionWithId } from "../../../utility";

export default function AddQuestionsTab({
  scopeId,
  comingQuestions,
  sendQuestions,
  packageId,
  sendQuestionLimitation,
  comingPackage,
}) {
  const [questionTitle, setQuestionTitle] = useState("");
  const [tag, setTag] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isFree, setIsFree] = useState("");
  const [isForMock, setIsForMock] = useState("");
  const [creationDateFrom, setCreationDateFrom] = useState("");
  const [creationDateTo, setCreationDateTo] = useState("");
  const [isExamQu, setIsExamQu] = useState("");
  const [values, setValues] = useState({});

  const { enqueueSnackbar } = useSnackbar();
  const [questions, setQuestions] = useState([]);

  const [limit, setLimit] = useState(0);

  // packages Redux state
  const dispatch = useDispatch();
  const { listLoading, filteredQuestions } = useSelector(
    (state) => ({
      listLoading: state.packages.listLoading,
      filteredQuestions: state.packages.filteredQuestions,
    }),
    shallowEqual
  );

  useEffect(() => {
    const addTags = comingQuestions?.map((i) => ({
      id: i.id,
      billable_id: i.billable_id,
      value: i.title,
      label: i.title,
    }));
    setQuestions(addTags);
  }, [comingQuestions]);

  useEffect(() => {
    sendQuestionLimitation(limit);
  }, [limit]);

  useEffect(() => {
    setLimit(
      comingPackage?.scopes?.find((i) => i?.scope?.billable_type == "questions")
        ?.limit
    );
  }, [comingPackage]);

  return (
    <>
      {/* <br />

      <Alert severity="warning">
        Attention! Please consider that you are able to set "Usage Limitation"
        only during the package creation and it could not be changed in the
        updating process.
      </Alert>

      <br />
      <div className="form-group row" style={{ marginTop: 10 }}>
        <div className="col-lg-4">
          <Field
            type="number"
            name="limit"
            disableValidation={true}
            min="0"
            component={Input}
            disabled={packageId}
            placeholder="Usage Limitation"
            label="Usage Limitation"
            onChange={(e) => {
              const { value } = e.target;
              setLimit(value);
            }}
            value={limit}
          />
        </div>
      </div> */}
      <div className="form-group row" style={{marginTop:30}}>
        <div className="col-lg-12">
          <label>Added Questions</label>
          <br />
          <SelectInput
            value={questions}
            isMulti
            name="colors"
            isSearchable={false}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(remainItems) => {
              const removingTags = difference(questions, remainItems);
              dispatch(
                actions.removeBillFromScope(scopeId, [
                  removingTags[0].billable_id,
                ])
              );
              setQuestions(remainItems);
            }}
            noOptionsMessage={(str) => "To add items, please filter below."}
            placeholder="No items."
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 45,
        }}
      >
        <div
          style={{
            border: "1px solid #e4e6ef",
            width: "100%",
            marginRight: 12,
          }}
        ></div>
        <div>Or</div>
        <div
          style={{ border: "1px solid #e4e6ef", width: "100%", marginLeft: 12 }}
        ></div>
      </div>

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

      <div className="form-group row">
        <div className="col-lg-4" style={{ marginTop: "20px" }}>
          <Select
            label="Question Type"
            value={questionType}
            disabled={tag ? true : false}
            mandatory={false}
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
            disabled={tag ? true : false}
            mandatory={false}
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
            captionHide={true}
            disabled={tag ? true : false}
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
            captionHide={true}
            disabled={tag ? true : false}
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
      <QuestionTable
        filterdQuestions={filteredQuestions}
        onAdd={(questions) => {
          const addTags = questions.map((i) => ({
            id: i.id,
            billable_id: i.billable_id,
            value: i.title,
            label: i.title,
          }));
          setQuestions((prev) => {
            if (prev) return mergeFunctionWithId([...prev, ...addTags]);
            else return [...addTags];
          });
          if (scopeId) {
            dispatch(
              actions.addBillToScope(
                scopeId,
                questions?.map((i) => i.billable_id)
              )
            );
            SnackbarUtils.success("Questions added Successfully!");
          } else {
            sendQuestions(questions?.map((i) => i.billable_id));
          }
        }}
        filterValues={values}
      />
    </>
  );
}
