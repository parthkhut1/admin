// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/questionsActions";
import {
  Select,
  Textarea,
  Switch,
  AddOption,
  Input,
} from "../../../../../../_metronic/_partials/controls";

import {
  attachTagToElement,
  detachTagToElement,
  findTags,
} from "../../../../../tagService";
import AsyncSelect from "react-select/async";
import { difference } from "lodash";

import { shuffle } from "./../../../../../utility";
import SnackbarUtils from "./../../../../../notistack";

import { useQuestionsUIContext } from "../QuestionsUIContext";

// Validation schema
const QuestionEditSchema = Yup.object().shape({});

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

  //textarea function
  const [textareaInput, setTextareaInput] = useState("");
  const [textareaInputArray, setTextareaInputArray] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [addBlankSwitch, setAddBlankSwitch] = useState(false);
  //textarea function

  //options function
  const [options, setOptions] = useState([]);
  const [incorrectOptions, setIncorrectOptions] = useState([]);
  const [answer, setAnswer] = useState([]);

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
      question_data: { options },
    } = question;
    const {
      answer: { answer },
      tags,
    } = question;

    setSelectedWords([]);
    let index = 0;
    const inputTextWithoutBlanks = text
      ?.trim()
      .split(/\s+/)
      .map((wrd, idx) => {
        if (wrd === "<blank/>") {
          const ans = answer[index];
          setSelectedWords((prev) => [...prev, { wrd: ans, index: idx }]);
          index++;
          return ans;
        }
        return wrd;
      })
      .join(" ");

    setTextareaInput(inputTextWithoutBlanks);

    // setOptions(question.question_data.options);
    // if (question?.answer?.answer) setAnswer(question.answer.answer);

    if (question) {
      setIncorrectOptions(
        options
          .filter((op) => answer.indexOf(op) === -1)
          .map((op) => ({ wrd: op }))
      );
    }

    // if (question?.question_data?.text)
    //   setTextareaInput(question?.question_data?.text);
    if (tags?.length !== 0)
      setTags(() => tags?.map((i) => ({ value: i, label: i })));
    else setTags([]);
  }, [question]);

  //options function

  //textarea function
  useEffect(() => {
    setOptions([...selectedWords, ...incorrectOptions]);
  }, [selectedWords, incorrectOptions]);

  useEffect(() => {
    if (addBlankSwitch === true) {
      setTextareaInputArray(textareaInput.trim().split(/\s+/));
    }
  }, [addBlankSwitch]);
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

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={question}
        validationSchema={QuestionEditSchema}
        onSubmit={(values) => {
          if (selectedWords.length == 0)
            return SnackbarUtils.error("Please select some words from text");
          if (incorrectOptions.length == 0)
            return SnackbarUtils.error("Please add some options");

          const selectedWordIndexes = selectedWords.map((sw) => sw.index);
          const text = textareaInput
            .trim()
            .split(/\s+/)
            .map((wrd, idx) =>
              selectedWordIndexes.findIndex((i) => i === idx) !== -1
                ? "<blank/>"
                : wrd
            )
            .join(" ");

          const newValue = {
            ...values,
            question_type: "ReadingFillInTheBlanks",
            question_data: {
              text: text,
              options: shuffle(options.map((i) => i.wrd)),
            },
            answer: {
              answer: selectedWords.map((i) => i.wrd),
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

                {addBlankSwitch ? (
                  <div>
                    <h6 style={{ paddingBottom: "5px" }}>
                      Please click on the words you want to hide{" "}
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

                            if (existWordIndex == -1)
                              setSelectedWords((prev) => [
                                ...prev,
                                { wrd: wrd, index, disableEditBtn: true },
                              ]);
                            else {
                              setSelectedWords((prev) =>
                                prev.filter(
                                  (i) => i.wrd !== wrd || i.index !== index
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
                          if (textareaInput !== e.currentTarget.value) {
                            setOptions([]);
                            setSelectedWords([]);
                          }
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
                  label="Define blanks and options"
                  checked={addBlankSwitch}
                  onChange={(e) => {
                    setAddBlankSwitch(e.target.checked);
                  }}
                />

                <div className="form-group row">
                  <div className="col-lg-12">
                    <div style={{ paddingBottom: "5px" }}>
                      Add Blank Items <span style={{ color: "red" }}> *</span>
                    </div>
                    <Field
                      name="option"
                      component={AddOption}
                      label="Blank"
                      answer={answer}
                      options={options.map((opt) => opt.wrd)}
                      rFillBlanksOptions={options}
                      hasMultiAnswers={true}
                      onAddOption={(option) => {
                        if (
                          option &&
                          !incorrectOptions.find((i) => i.wrd == option)
                        ) {
                          setIncorrectOptions((opts) => [
                            ...opts,
                            { wrd: option },
                          ]);
                        } else {
                        }
                      }}
                      onRemoveOption={(option, index) => {
                        const newOptions = incorrectOptions.filter(
                          (opt) => opt.wrd !== option
                        );
                        setIncorrectOptions(newOptions);

                        setSelectedWords((prev) =>
                          prev.filter(
                            (i) =>
                              i.wrd !== option ||
                              i.index !== options[index].index
                          )
                        );

                        // const newSelectedWords = selectedWords.filter(
                        //   (opt) => opt.wrd !== option
                        // );
                        // setSelectedWords(newSelectedWords);
                      }}
                      onUpdateAnswer={(updatedText, index) => {
                        setIncorrectOptions((prev) => {
                          const newOpt = [...prev];
                          newOpt[index].wrd = updatedText;
                          return newOpt;
                        });
                      }}
                      onSelectAnswer={(ans) =>
                        setAnswer((prev) => {
                          const itemIndex = prev.findIndex(
                            (item) => item === ans
                          );
                          if (itemIndex !== -1) {
                            return prev.filter((item) => item !== ans);
                          } else {
                            return [...prev, ans];
                          }
                        })
                      }
                    />
                  </div>
                </div>
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
