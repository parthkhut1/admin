// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import CreatableSelect from "react-select";
import produce from "immer";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/questionsActions";

import clsx from "clsx";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import OutlinedInput from "@material-ui/core/OutlinedInput";

import * as Yup from "yup";
import {
  Select,
  Textarea,
  Switch,
  Input,
} from "../../../../../../_metronic/_partials/controls";
import {
  attachTagToElement,
  detachTagToElement,
  findTags,
} from "../../../../../tagService";
import AsyncSelect from "react-select/async";
import { difference } from "lodash";

import SnackbarUtils from "./../../../../../notistack";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";

import { useQuestionsUIContext } from "../QuestionsUIContext";

// Validation schema
const QuestionEditSchema = Yup.object().shape({
  name: Yup.string(),
});

export function QuestionEditForm({
  saveQuestion,
  question,
  actionsLoading,
  onHide,
}) {
  const dispatch = useDispatch();
  const questionsUIContext = useQuestionsUIContext();
  const questionsUIProps = useMemo(() => {
    return {
      ids: questionsUIContext.ids,
      setIds: questionsUIContext.setIds,
      queryParams: questionsUIContext.queryParams,
    };
  }, [questionsUIContext]);
  const [tags, setTags] = useState([]);

  const [keywords, setKeywords] = useState({});

  //textarea function
  const [textareaInput, setTextareaInput] = useState("");
  const [textareaInputArray, setTextareaInputArray] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);
  const [addBlankSwitch, setAddBlankSwitch] = useState(false);
  const [questionInputLink, setQuestionInputLink] = useState("");

  //textarea function

  // useEffect(() => {
  //   console.log("keywords", keywords);
  // }, [keywords]);

  // useEffect(() => {
  //   console.log("selectedWords", selectedWords);
  // }, [selectedWords]);

  // useEffect(() => {
  //   console.log("CW", correctWords);
  // }, [correctWords]);

  //textarea function
  useEffect(() => {
    if (addBlankSwitch === true) {
      setTextareaInputArray(textareaInput.trim().split(/\s+/));
    }
  }, [addBlankSwitch, textareaInput]);
  //textarea function

  // dropZone functions
  const [fileInput, setFileInput] = useState(null);

  const handleChangeStatus = ({ file }, status) => {
    setFileInput(file);
  };

  const IAVhandleSubmit = (files, allFiles) => {
    allFiles.forEach((f) => f.remove());
    setFileInput(null);
  };
  // dropZone functions

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
  const filterTags = async (inputValue) => {
    const {
      data: {
        payload: { data },
      },
    } = await findTags(inputValue);
    const newData = data.map((i) => ({ value: i.name, label: i.name }));
    return newData;
  };

  const promiseTagsOptions = (inputValue) =>
    new Promise((resolve) => {
      resolve(filterTags(inputValue));
    });
  useEffect(() => {
    const {
      question_data: { text },
    } = question;

    const {
      question_media: { audio },
      tags,
    } = question;

    // const {
    //   answer: { answer },
    // } = question;

    const answer = question?.answer?.answer;
    const corrects = question?.answer?.answer_meta?.corrects;

    // const {
    //   answer_meta: { corrects },
    // } = question;

    if (audio)
      setQuestionInputLink(
        Object.values(audio)[Object.values(audio).length - 1]
      );

    console.log("qu", question);

    setCorrectWords(corrects);
    setSelectedWords(answer);

    setTextareaInput(text);
    if (tags?.length !== 0)
      setTags(() => tags?.map((i) => ({ value: i, label: i })));
    else setTags([]);
  }, [question]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={question}
        validationSchema={QuestionEditSchema}
        onSubmit={(values) => {
          const newValue = {
            ...values,
            fileInput,
            question_data: {
              text: textareaInput,
            },
            question_meta: {
              ...values.question_meta,
              transcript: values.question_data?.text,
            },
            answer: {
              answer: selectedWords,
              answer_meta: {
                corrects: correctWords,
              },
            },
          };

          if (!newValue.title || newValue.title.length == 0)
            delete newValue["title"];

          saveQuestion(newValue, questionsUIProps.queryParams);
        }}
      >
        {({
          handleSubmit,
          values,
          setFieldValue,
          handleBlur,
          setFieldTouched,
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div
                  className="overlay-layer bg-transparent"
                  style={{ zIndex: 10 }}
                >
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-12">
                    <Select
                      name="difficulty"
                      label="Difficulty"
                      onChange={(e) => {
                        setFieldValue("difficulty", e.target.value);
                      }}
                      onBlur={handleBlur}
                      value={values.difficulty}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </Select>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-4">
                    <Field
                      name="is_free"
                      component={Switch}
                      label="Paid/Free"
                      checked={values.is_free}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setFieldValue("is_free", checked);
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
                    <Field
                      name="examQu"
                      component={Switch}
                      label="Exam question?"
disabled={question.report_counter}
                      checked={values.examQu}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setFieldValue("examQu", checked);
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
                    <Field
                      name="is_for_mock"
                      component={Switch}
                      label="Is for mock test: No/Yes"
                      checked={+values.is_for_mock}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setFieldValue("is_for_mock", checked?1:0);
                      }}
                    />
                  </div>
                </div>
                {values.id ? (
                  <div className="form-group row" style={{ marginBottom: 20 }}>
                    <div className="col-lg-12">
                      <label>Tags</label>
                      <br />
                      <AsyncSelect
                        isMulti
                        name="tags"
                        isClearable={false}
                        cacheOptions
                        defaultOptions
                        loadOptions={promiseTagsOptions}
                        getOptionLabel={(option) =>
                          `${option?.label ? option?.label : ""}`
                        }
                        getOptionValue={(option) => option.value}
                        value={tags}
                        onChange={(value) => {
                          const deletedTag = difference(tags, value);
                          setTags(value);
                          if (deletedTag.length != 0)
                            detachTagToElement(
                              deletedTag.pop()?.label,
                              "questions",
                              values.id
                            ).then((res) => {
                              dispatch(
                                actions.fetchQuestions(
                                  questionsUIProps.queryParams
                                )
                              );
                            });
                          else
                            attachTagToElement(
                              value[value.length - 1].label,
                              "questions",
                              values.id
                            ).then((res) => {
                              dispatch(
                                actions.fetchQuestions(
                                  questionsUIProps.queryParams
                                )
                              );
                            });
                        }}
                        onBlur={() => setFieldTouched("tags", true)}
                      />
                    </div>
                  </div>
                ) : (
                  <p style={{ marginBottom: 20 }}>
                    For adding tags, please first click on save button
                  </p>
                )}

                <div className="form-group row">
                  <div className="col-lg-12">
                    <Field
                      name="title"
                      disableValidation={true}
                      component={Input}
                      placeholder="Question Title"
                      label="Question Title"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-12" style={{ marginTop: "20px" }}>
                    <div style={{ paddingBottom: "5px" }}>
                      Upload Question Audio
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <Dropzone
                      onChangeStatus={handleChangeStatus}
                      submitButtonContent="Clear"
                      onSubmit={IAVhandleSubmit}
                      maxFiles={1}
                      // accept="image/*,audio/*,video/*"
                      accept="audio/*"
                      inputContent={(files, extra) =>
                        extra.reject
                          ? "Image, audio and video files only"
                          : "Click or Drag Files"
                      }
                      styles={{
                        dropzoneReject: {
                          borderColor: "red",
                          backgroundColor: "#DAA",
                        },
                        inputLabel: (files, extra) =>
                          extra.reject ? { color: "red" } : {},
                      }}
                    />
                  </div>
                </div>

                {questionInputLink && (
                  <div className="form-group row">
                    <div className="col-lg-12">
                      <h6>For update, just upload another file.</h6>
                      <audio controls>
                        <source src={questionInputLink} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                )}

                {/* <div className="form-group row">
                  <div className="col-lg-12" style={{ marginTop: "20px" }}>
                    <Field
                      name="question_meta.transcript"
                      component={Textarea}
                      mandatory={true}
                      placeholder="Question Transcript"
                      label="Question Transcript"
                      rows={10}
                      cols={20}
                    />
                  </div>
                </div> */}

                {addBlankSwitch ? (
                  <div>
                    <h6 style={{ paddingBottom: "5px" }}>
                      Please click on the words you want to hide{" "}
                      <span style={{ color: "red" }}> *</span>
                    </h6>

                    {textareaInputArray.map((wrd, index) => {
                      let style = { ...baseClass };
                      if (
                        selectedWords?.findIndex(
                          (i) => i.value === wrd && i.key === index
                        ) !== -1
                      ) {
                        style = { ...baseClass, ...selectedClass };
                      }
                      return (
                        <p
                          key={wrd + index}
                          style={style}
                          className={
                            selectedWords?.findIndex(
                              (i) => i.value === wrd && i.key === index
                            ) !== -1
                              ? selectedClass
                              : ""
                          }
                          onClick={() => {
                            const existWordIndex = selectedWords?.findIndex(
                              (i) => i.value === wrd && i.key === index
                            );

                            if (existWordIndex === -1) {
                              setSelectedWords((prev) => [
                                ...prev,
                                { value: wrd, key: index },
                              ]);
                            } else {
                              setSelectedWords((prev) =>
                                prev.filter(
                                  (i) => i.value !== wrd || i.key !== index
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
                ) : (
                  <div className="form-group row">
                    <div className="col-lg-12">
                      <Field
                        name="question_data.text"
                        component={Textarea}
                        mandatory={true}
                        placeholder="Question Text"
                        label="Question Text"
                        onChange={(e) => {
                          if (textareaInput !== e.currentTarget.value)
                            setSelectedWords([]);
                          setTextareaInput(e.currentTarget.value);
                        }}
                        value={textareaInput}
                        rows={10}
                        cols={20}
                      />
                    </div>
                  </div>
                )}
                <hr />
                <Field
                  name="toggleBtn"
                  component={Switch}
                  label="Select Incorrect words"
                  checked={addBlankSwitch}
                  onChange={(e) => {
                    setAddBlankSwitch(e.target.checked);
                  }}
                />

                {selectedWords && selectedWords.length > 0
                  ? selectedWords.map((sw, idx) => (
                      <BlankOptions
                        key={sw.value + sw.key}
                        word={sw}
                        index={idx}
                        inputText={correctWords.find(
                          (obj) => obj.key == sw.key
                        )}
                        onChange={(correctWord) =>
                          setCorrectWords((prev) =>
                            produce(prev, (draft) => {
                              const findIndex = draft.findIndex(
                                (cw) => cw.key === sw.key
                              );
                              const val = {
                                key: sw.key,
                                value: correctWord,
                              };
                              if (findIndex !== -1) draft[findIndex] = val;
                              else {
                                draft.push(val);
                              }
                            })
                          )
                        }
                      />
                    ))
                  : null}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
                disabled={actionsLoading}
              >
                Cancel
              </button>
              <> </>
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary btn-elevate"
                disabled={actionsLoading}
              >
                Save
              </button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}

const BlankOptions = ({ word, index, onChange, inputText }) => {
  // keywords inputs functions

  const handleChange = (event) => {
    const { value } = event.target;
    onChange(value);
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    margin: {
      margin: theme.spacing(1),
      marginLeft: theme.spacing(0),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: "100%",
    },
  }));
  const classes1 = useStyles();

  // keywords inputs functions

  return (
    <div className="form-group row">
      <div className="col-lg-12">
        <div style={{ paddingBottom: "5px" }}>
          Write correct of{" "}
          <span style={{ fontWeight: "bold" }}>{word.value}</span>
          <span style={{ color: "red" }}> *</span>
        </div>
        <FormControl fullWidth className={classes1.margin} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-amount">
            Incorrect word {index + 1}
          </InputLabel>
          <OutlinedInput
            value={inputText?.value}
            onChange={handleChange}
            startAdornment={
              <InputAdornment position="start">
                <span
                  style={{
                    backgroundColor: "red",
                    color: "#fff",
                    padding: "5px",
                    borderRadius: "3px",
                  }}
                >
                  {word.value}
                </span>
              </InputAdornment>
            }
            labelWidth={100}
          />
        </FormControl>
      </div>
    </div>
  );
};
