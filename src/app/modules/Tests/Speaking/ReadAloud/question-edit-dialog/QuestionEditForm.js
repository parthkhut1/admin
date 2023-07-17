// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/questionsActions";

import CreatableSelect from "react-select";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import { useSnackbar } from "notistack";
import GetAppIcon from "@material-ui/icons/GetApp";

import * as Yup from "yup";
import {
  Select,
  Textarea,
  Switch,
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
  // question_meta: Yup.object().shape({
  //   taskText: Yup.string().required("Task Text is required"),
  // }),
  // question_data: Yup.object().shape({
  //   text: Yup.string().required("Text is required"),
  // }),
});

export function QuestionEditForm({
  saveQuestion,
  question,
  actionsLoading,
  onHide,
}) {
  const dispatch = useDispatch();
  const questionsUIContext = useQuestionsUIContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const questionsUIProps = useMemo(() => {
    return {
      ids: questionsUIContext.ids,
      setIds: questionsUIContext.setIds,
      queryParams: questionsUIContext.queryParams,
    };
  }, [questionsUIContext]);

  const [tags, setTags] = useState([]);

  // keywords inputs functions
  const createOption = (label) => ({
    label,
    value: label,
  });

  const [inputKeywords, setInputKeywords] = useState("");
  const [keywords, setKeywords] = useState([]);

  const handleChange = (value, actionMeta) => {
    if (value === null) setKeywords([]);
    else setKeywords(value);
  };

  const handleInputChange = (inputValue) => {
    setInputKeywords(inputValue);
  };

  const handleKeyDown = (event) => {
    if (!inputKeywords) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setInputKeywords("");
        setKeywords((value) => {
          if (!value) return [createOption(inputKeywords)];
          else return [...value, createOption(inputKeywords)];
        });
        event.preventDefault();
    }
  };

  // keywords inputs functions

  // dropZone functions
  const [fileInput, setFileInput] = useState(null);

  const handleChangeStatus = ({ file }) => {
    setFileInput(file);
  };

  const IAVhandleSubmit = (files, allFiles) => {
    allFiles.forEach((f) => f.remove());
    setFileInput(null);
  };
  // dropZone functions

  const download = (filename, text) => {
    var element = document.createElement("a");
    element.setAttribute("href", text);
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
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
      question_meta: { keywords },
      tags,
    } = question;
    setKeywords(keywords?.map((kw) => ({ label: kw, value: kw })));
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
          if (typeof values.is_free === "object")
            values.is_free = values.is_free.length != 0 ? 1 : 0;

          const newValue = {
            ...values,
            question_type: "ReadAloud",
            question_meta: {
              transcript: values.question_data.text,
              keywords: keywords?.map((kw) => kw.value),
            },
            question_media: [],
          };

          if (fileInput) {
            // formData.append("answer", fileInput);
            // formData.append("answer_meta[transcript]", values.question_data.text);
            newValue["answer"] = { answer: fileInput };
            newValue["answer"] = {
              ...newValue["answer"],
              answer_meta: { transcript: values.question_data.text },
            };
          }

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
                      component={Textarea}
                      mandatory={true}
                      placeholder="Question Text"
                      label="Question Text"
                      rows={10}
                      cols={20}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-12" style={{ paddingTop: "10px" }}>
                    <div style={{ paddingBottom: "5px" }}>
                      Upload Model Answer Audio
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

                {values.answer.answer && (
                  <div className="form-group row">
                    <div className="col-lg-12">
                      <h6>For update, just upload another file.</h6>
                      {/* <audio controls controlsList="nodownload"> */}
                      <audio controls>
                        <source src={values.answer.answer} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                      
                      {/* <a
                        style={{
                          position: "absolute",
                          top: 36,
                          cursor: "pointer",
                        }}
                        onClick={()=>download("This is the content",`${values.answer.answer}`)}
                      >
                        <GetAppIcon fontSize="large" />
                      </a> */}
                    </div>
                  </div>
                )}

                {/* <div className="form-group row">
                  <div className="col-lg-12">
                    <div style={{ paddingBottom: "5px" }}>Keywords</div>
                    <CreatableSelect
                      inputValue={inputKeywords}
                      components={{ DropdownIndicator: null }}
                      isClearable
                      isMulti
                      menuIsOpen={false}
                      onChange={handleChange}
                      onInputChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Type something and press enter..."
                      value={keywords}
                    />
                  </div>
                </div> */}
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
