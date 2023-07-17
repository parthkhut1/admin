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
  const [addBlankSwitch, setAddBlankSwitch] = useState(false);
  //textarea function

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
      tags,
    } = question;
    const {
      question_data: { blanks },
    } = question;
    const {
      answer: { answer },
    } = question;

    console.log("answer", answer);
    console.log("blanks", blanks);
    setSelectedWords([]);
    let index = 0;
    const inputTextWithoutBlanks = text
      ?.trim()
      .split(/\s+/)
      .map((wrd, idx) => {
        if (wrd === "<blank/>") {
          const ans = answer[index];
          const bl = blanks[index].filter((b) => b !== ans);
          setSelectedWords((prev) =>
            produce(prev, (draft) => {
              draft.push({ wrd: ans, index: idx });
            })
          );

          setKeywords((prev) => {
            console.log("prev", prev);
            return produce(prev, (draft) => {
              draft[idx] = [
                { label: ans, value: ans, isFixed: true },
                ...bl.map((i) => ({ label: i, value: i, isFixed: false })),
              ];
            });
          });
          index++;
          return ans;
        }
        return wrd;
      })
      .join(" ");

    setTextareaInput(inputTextWithoutBlanks);
    if (tags?.length !== 0)
      setTags(() => tags?.map((i) => ({ value: i, label: i })));
    else setTags([]);
  }, [question]);

  //textarea function
  useEffect(() => {
    if (addBlankSwitch === true) {
      setTextareaInputArray(textareaInput.trim().split(/\s+/));
    }
  }, [addBlankSwitch, textareaInput]);
  //textarea function

  useEffect(() => {
    console.log("keywords", keywords);
  }, [keywords]);
  useEffect(() => {
    console.log("selectedWords", selectedWords);
  }, [selectedWords]);

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
          if (textareaInput.length === 0)
            return SnackbarUtils.error("Please write question text");

          if (selectedWords.length === 0)
            return SnackbarUtils.error("Please select some words from text");

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
            question_type: "ReadingAndWritingFillInTheBlanks",
            question_data: {
              text: text,
              blanks: Object.keys(keywords)
                .sort((a, b) => a - b)
                .map((kwIndex) => keywords[kwIndex].map((kw) => kw.value)),
            },
            answer: {
              answer: [...selectedWords]
                .sort((a, b) => a.index - b.index)
                .map((i) => i.wrd),
            },
          };

          if (!newValue.title || newValue.title.length == 0)
            delete newValue["title"];

          const notValid = Object.keys(keywords).some(
            (kwIndex) => keywords[kwIndex].length < 2
          );

          if (notValid)
            return SnackbarUtils.error(
              "Please write at least an option for every word."
            );

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

                            if (existWordIndex === -1) {
                              setSelectedWords((prev) => [
                                ...prev,
                                { wrd, index },
                              ]);
                              setKeywords((prev) => {
                                const newKeywords = { ...prev };
                                console.log("newKeywords&&&", newKeywords);
                                newKeywords[index] = [
                                  { label: wrd, value: wrd, isFixed: true },
                                ];

                                return newKeywords;
                              });
                            } else {
                              setSelectedWords((prev) =>
                                prev.filter(
                                  (i) => i.wrd !== wrd || i.index !== index
                                )
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
                            setKeywords([]);
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

                {selectedWords.length > 0
                  ? selectedWords.map((sw) => (
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

const BlankOptions = ({ word, keywords, setKeywords }) => {
  // keywords inputs functions

  const [inputKeywords, setInputKeywords] = useState("");

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
          placeholder="Type something and press enter..."
          value={keywords}
        />
      </div>
    </div>
  );
};
