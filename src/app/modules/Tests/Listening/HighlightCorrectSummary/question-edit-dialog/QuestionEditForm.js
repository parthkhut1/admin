// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import { Formik, Form, Field } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/questionsActions";
import * as Yup from "yup";
import {
  Select,
  Textarea,
  Switch,
  AddOption,
  Input,
} from "../../../../../../_metronic/_partials/controls";

import { useQuestionsUIContext } from "../QuestionsUIContext";
import {
  attachTagToElement,
  detachTagToElement,
  findTags,
} from "../../../../../tagService";
import AsyncSelect from "react-select/async";
import { difference } from "lodash";

// Validation schema
const QuestionEditSchema = Yup.object().shape({
  // name: Yup.string()
  //   .min(3, "Minimum 3 symbols")
  //   .max(50, "Maximum 50 symbols")
  //   .required("Name is required"),
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

  //options function

  const [questionInputLink, setQuestionInputLink] = useState("");
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");

  //options function

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
      question_media: { audio },
      answer: { answer },
      tags,
    } = question;
    if (audio)
      setQuestionInputLink(
        Object.values(audio)[Object.values(audio).length - 1]
      );
    setOptions(question.question_data.options);
    if (answer) setAnswer(answer);
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
              text: values.question_data.text,
              options,
            },
            answer: {
              answer,
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
                  <div className="col-lg-12">
                    <Field
                      name="question_data.text"
                      disableValidation={true}
                      component={Input}
                      placeholder="Short Question"
                      label="Short Question"
                    />
                  </div>
                </div>
                {/* <div className="form-group row">
                  <div className="col-lg-12">
                    <Field
                      name="question_data.text"
                      component={Textarea}
                      mandatory={true}
                      placeholder="Question Text"
                      label="Question Text"
                      rows={10}
                      cols={20}
                    />
                  </div>
                </div> */}

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

                <div className="form-group row">
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
                </div>

                <div className="form-group row">
                  <div className="col-lg-12">
                    <div style={{ paddingBottom: "5px" }}>
                      Enter Question Options{" "}
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <Field
                      name="option"
                      component={AddOption}
                      label="Option"
                      answer={answer}
                      options={options}
                      inputType="radio"
                      onAddOption={(option) => {
                        if (option && !options.find((i) => i === option))
                          setOptions((opts) => [...opts, option]);
                      }}
                      onRemoveOption={(option) => {
                        const newOptions = options.filter(
                          (opt) => opt !== option
                        );
                        setOptions(newOptions);
                        if (answer === option) setAnswer("");
                      }}
                      onUpdateAnswer={(updatedText, index) => {
                        setOptions((prev) => {
                          const newOpt = [...prev];
                          newOpt[index] = updatedText;
                          return newOpt;
                        });
                      }}
                      onSelectAnswer={setAnswer}
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
