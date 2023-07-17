// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import * as Yup from "yup";
import { format, parseISO } from "date-fns";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/coursesActions";
import { difference } from "lodash";
import { Editor } from "@tinymce/tinymce-react";

import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";

import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import { useSnackbar } from "notistack";

import "react-quill/dist/quill.snow.css";
import "./quillStyle.css";

import ExistingQuestionsTab from "../components/ExistingQuestionsTab";
import AddQuestionsTab from "../components/AddQuestionsTab";

import ExistingKnowledgeTestTab from "../components/ExistingKnowledgeTestTab";
import AddKnowledgeTestTab from "../components/AddKnowledgeTestTab";

import ReactQuill, { Quill } from "react-quill";
import axios from "axios";

// #1 import quill-image-uploader
import ImageUploader from "quill-image-uploader";

import {
  Input,
  DatePickerField,
  Switch,
  Select,
} from "../../../../_metronic/_partials/controls";
import { useCoursesUIContext } from "../CoursesUIContext";
import QuestionSelect from "react-select";

// #2 register module
Quill.register("modules/imageUploader", ImageUploader);
const modules = {
  // #3 Add "image" to the toolbar
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean", "image", "video", "link"],
  ],
  // # 4 Add module and upload function
  imageUploader: {
    upload: async (file) => {
      const bodyFormData = new FormData();
      bodyFormData.append("file", file);
      const response = await axios({
        method: "post",
        url: "/media",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.payload.url;
    },
  },
};

export function CourseEditForm({ saveCourse, course, actionsLoading, onHide }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { level0, level1, level2, questions } = useSelector(
    (state) => ({
      level0: state.courses.level0,
      level1: state.courses.level1,
      level2: state.courses.level2,
      questions: state.courses.questions,
    }),
    shallowEqual
  );
  const coursesUIContext = useCoursesUIContext();
  const [value, setValue] = useState("");
  const [selectedTab, setSelectedTab] = useState("");
  const [selectedSpeakingQuestions, setSelectedSpeakingQuestions] = useState(
    []
  );
  const [selectedWritingQuestions, setSelectedWritingQuestions] = useState([]);
  const [selectedReadingQuestions, setSelectedReadingQuestions] = useState([]);
  const [selectedListeningQuestions, setSelectedListeningQuestions] = useState(
    []
  );

  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [knowledgeTests, setKnowledgeTests] = useState([]);

  const [fileInput, setFileInput] = useState("");
  const [progress, setProgress] = React.useState(0);

  const coursesUIProps = useMemo(() => {
    return {
      ids: coursesUIContext.ids,
      setIds: coursesUIContext.setIds,
      queryParams: coursesUIContext.queryParams,
    };
  }, [coursesUIContext]);

  const getSkillsQuestions = (questionId) => {
    getSpeakingQuestions(course?.questions?.data);
    getWritingQuestions(course?.questions?.data);
    getReadingQuestions(course?.questions?.data);
    getListeningQuestions(course?.questions?.data);
  };

  const getSpeakingQuestions = (questions) => {
    setSelectedSpeakingQuestions(
      questions?.filter((qu) => qu.category === "Speaking")
    );
  };

  const getWritingQuestions = (questions) => {
    setSelectedWritingQuestions(
      questions?.filter((qu) => qu.category === "Writing")
    );
  };
  const getReadingQuestions = (questions) => {
    setSelectedReadingQuestions(
      questions?.filter((qu) => qu.category === "Reading")
    );
  };
  const getListeningQuestions = (questions) => {
    setSelectedListeningQuestions(
      questions?.filter((qu) => qu.category === "Listening")
    );
  };

  // dropZone functions

  const handleChangeStatus = async (e) => {
    setProgress(0);
    setFileInput("");
    const bodyFormData = new FormData();
    bodyFormData.append("file", e.target.files[0]);

    try {
      const response = await axios({
        method: "post",
        url: "/media",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: function(progressEvent) {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });
      setFileInput(response.data.payload.url);
      return response.data.payload.url;
    } catch (error) {
      setProgress(0);
      setFileInput("");
      document.getElementById("files-upload").value = null;
      return enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  //...............

  // dropZone functions

  useEffect(() => {
    dispatch(actions.fetchCategoryChilds(0, 0));
  }, []);

  useEffect(() => {
    if (course?.content) {
      setValue(course?.content);
      setFileInput(course?.content)
    }
    getSkillsQuestions(1);
  }, [course]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={course}
        onSubmit={(values) => {
          const newValues = {
            ...values,
          };
          if (values.parentIdLevel0 == 0)
            newValues["course_category_id"] = null;
          else if (values.parentIdLevel0 != 0 && values.parentIdLevel1 == 0)
            newValues["course_category_id"] = values.parentIdLevel0;
          else if (
            values.parentIdLevel0 != 0 &&
            values.parentIdLevel1 != 0 &&
            values.parentIdLevel2 == 0
          )
            newValues["course_category_id"] = values.parentIdLevel1;
          else if (
            values.parentIdLevel0 != 0 &&
            values.parentIdLevel1 != 0 &&
            values.parentIdLevel2 == 0
          )
            newValues["course_category_id"] = values.parentIdLevel1;
          else if (
            values.parentIdLevel0 != 0 &&
            values.parentIdLevel1 != 0 &&
            values.parentIdLevel2 != 0
          )
            newValues["course_category_id"] = values.parentIdLevel2;

          if (
            values.parentNameLevel2?.trim().toLowerCase() ===
              "practice questions" ||
            values.parentNameLevel2?.trim().toLowerCase() === "knowledge tests"
          ) {
            newValues["content"] = "content";
            newValues["questions"] =
              practiceQuestions.length == 0
                ? knowledgeTests
                : practiceQuestions;
          }

          if (
            values.parentNameLevel2?.trim().toLowerCase() === "training videos"
          )
            newValues["content"] = value.replaceAll(
              "<iframe ",
              '<iframe width="500" height="400" '
            );

          if (
            values.parentNameLevel2?.trim().toLowerCase() ===
            "learning resources"
          )
            newValues["content"] = fileInput;

          saveCourse(newValues, coursesUIProps.queryParams);
        }}
      >
        {({ handleSubmit, values, setFieldValue, setFieldTouched }) => (
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
                <Tabs
                  defaultActiveKey="createCourse"
                  onSelect={(e) => {
                    dispatch(actions.resetFilteredQuestions());
                    setSelectedTab(e);
                    if (values.id && e === "existingQuestionsTab")
                      getSkillsQuestions(values.id, e);
                  }}
                >
                  <Tab eventKey="createCourse" title="Create course">
                    <div className="form-group row" style={{ marginTop: 40 }}>
                      <div className="col-lg-12">
                        <Field
                          type="text"
                          name="title"
                          mandatory={true}
                          component={Input}
                          disableValidation={true}
                          placeholder="Title"
                          label="Title"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-5">
                        <Field
                          name="is_free"
                          component={Switch}
                          mandatory={false}
                          label="Paid/Free"
                          checked={values.is_free}
                          onChange={(e) => {
                            const { checked } = e.target;
                            setFieldValue("is_free", checked);
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-5">
                        <DatePickerField
                          name="published_at"
                          label="Course Published at"
                          value={`${format(
                            new Date(values.published_at),
                            "yyyy-MM-dd"
                          )}  ,  ${format(
                            new Date(values.published_at),
                            "HH:mm"
                          )}`}
                          captionHide={true}
                          sendDate={(date) => {
                            // console.log("date", date);
                          }}
                          maxDate={new Date()}
                          mandatory={false}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="time"
                          dateFormat="yyyy-MM-dd HH:mm"
                        />
                      </div>
                    </div>

                    {!values.id && (
                      <>
                        <div
                          className="form-group row"
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            marginTop: 40,
                          }}
                        >
                          <div className="col-lg-5">
                            <Select
                              label="Select category"
                              name="level0"
                              value={values.parentIdLevel0}
                              mandatory={false}
                              onChange={(e) => {
                                const { value } = e.target;
                                setFieldValue("parentIdLevel0", value);
                                setFieldValue("parentIdLevel1", 0);
                                setFieldValue("parentIdLevel2", 0);
                                dispatch(actions.resetLevel1());
                                dispatch(actions.resetLevel2());

                                if (value != 0)
                                  dispatch(
                                    actions.fetchCategoryChilds(value, 1)
                                  );
                              }}
                            >
                              <option value={0}></option>
                              {level0.map((i) => (
                                <option key={`${i.id}${i.name}`} value={i.id}>
                                  {i.name}
                                </option>
                              ))}
                            </Select>
                          </div>
                          <div
                            className="col-lg-2"
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#3699FF",
                              borderRadius: 4,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: 14,
                              fontWeight: 500,
                              cursor: "pointer",
                              marginRight: 14,
                            }}
                            onClick={() => {
                              dispatch(actions.resetLevel1());
                              dispatch(actions.resetLevel2());
                              setFieldValue("parentIdLevel0", 0);
                              setFieldValue("parentIdLevel1", 0);
                              setFieldValue("parentIdLevel2", 0);
                            }}
                          >
                            <span>Reset</span>
                          </div>
                        </div>

                        {level1.length != 0 && (
                          <div className="form-group row">
                            <div className="col-lg-5">
                              <Select
                                label="Select category"
                                name="level1"
                                value={values.parentIdLevel1}
                                mandatory={false}
                                onChange={(e) => {
                                  const { value } = e.target;
                                  setFieldValue("parentIdLevel1", value);
                                  setFieldValue("parentIdLevel2", 0);
                                  dispatch(actions.resetLevel2());
                                  if (value != 0)
                                    dispatch(
                                      actions.fetchCategoryChilds(value, 2)
                                    );
                                }}
                              >
                                <option value={0}></option>
                                {level1.map((i) => (
                                  <option key={`${i.id}${i.name}`} value={i.id}>
                                    {i.name}
                                  </option>
                                ))}
                              </Select>
                            </div>
                          </div>
                        )}

                        {level2.length != 0 && (
                          <div className="form-group row">
                            <div className="col-lg-5">
                              <Select
                                label="Select category"
                                name="level2"
                                value={`${values.parentIdLevel2}$${values.parentNameLevel2}`}
                                mandatory={false}
                                onChange={(e) => {
                                  const { value } = e.target;
                                  const id = value.split("$")[0];
                                  const name = value.split("$")[1];
                                  setFieldValue("parentIdLevel2", id);
                                  setFieldValue("parentNameLevel2", name);
                                  console.log("e", name);
                                }}
                              >
                                <option value={0}></option>
                                {level2.map((i) => (
                                  <option
                                    key={`${i.id}${i.name}`}
                                    value={`${i.id}$${i.name}`}
                                  >
                                    {i.name}
                                  </option>
                                ))}
                              </Select>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {values.parentNameLevel2?.trim().toLowerCase() ===
                    "training videos" ? (
                      <div className="form-group row">
                        <div className="col-lg-12">
                          <label>Enter Course Content</label>
                          <span style={{ color: "red", marginBottom: 10 }}>
                            {" "}
                            *
                          </span>
                          <ReactQuill
                            theme="snow"
                            value={value}
                            modules={modules}
                            onChange={(content) => setValue(content)}
                            className="ql-editor"
                          />
                        </div>
                      </div>
                    ) : null}

                    {values.parentNameLevel2?.trim().toLowerCase() ===
                    "learning resources" ? (
                      <div className="form-group row">
                        <div
                          className="col-lg-12"
                          style={{ paddingTop: "10px" }}
                        >
                          <div style={{ paddingBottom: "5px" }}>
                            Upload Your File{" "}
                            <span style={{ color: "red" }}>*</span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                            }}
                          >
                            <input
                              type="file"
                              id="files-upload"
                              name="file"
                              onChange={handleChangeStatus}
                              accept=".pdf,.docx , .doc , .xls, .xlsx , .zip,.ppt,.pptx, .rar"
                            />
                            {progress > 0 && (
                              <CircularProgressWithLabel value={progress} />
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {values.id && values.category.name === "Learning Resources" ?(
                      <div className="form-group row">
                        <div className="col-lg-12">
                          Resource File:{" "}
                          <a href={fileInput}>Click to download</a>
                        </div>
                      </div>
                    ): null}
                  </Tab>

                  {values.parentNameLevel2?.trim().toLowerCase() ===
                    "practice questions" && (
                    <Tab
                      eventKey="addQuestionsTab"
                      title="Add Practice Questions"
                    >
                      <AddQuestionsTab
                        sendQuestions={setPracticeQuestions}
                        courseId={values?.id}
                      />
                    </Tab>
                  )}

                  {values.parentNameLevel2?.trim().toLowerCase() ===
                    "practice questions" && (
                    <Tab
                      eventKey="existingQuestionsTab"
                      title="Existing Practice Questions"
                    >
                      <ExistingQuestionsTab
                        courseId={values?.id}
                        selectedSpeakingQuestions={selectedSpeakingQuestions}
                        selectedWritingQuestions={selectedWritingQuestions}
                        selectedReadingQuestions={selectedReadingQuestions}
                        selectedListeningQuestions={selectedListeningQuestions}
                        updatedQuestionsAfterRemove={() => {
                          getSkillsQuestions(values?.id);
                        }}
                      />
                    </Tab>
                  )}

                  {values.parentNameLevel2?.trim().toLowerCase() ===
                    "knowledge tests" && (
                    <Tab
                      eventKey="addKnowledgeTestTab"
                      title="Add Knowledge Test"
                    >
                      <AddKnowledgeTestTab
                        sendKnowledgeTests={setKnowledgeTests}
                        courseId={values?.id}
                      />
                    </Tab>
                  )}

                  {values.parentNameLevel2?.trim().toLowerCase() ===
                    "knowledge tests" && (
                    <Tab
                      eventKey="existingKnowledgeTestTab"
                      title="Existing Knowledge Test"
                    >
                      <ExistingKnowledgeTestTab
                        courseId={values?.id}
                        selectedSpeakingQuestions={selectedSpeakingQuestions}
                        selectedWritingQuestions={selectedWritingQuestions}
                        selectedReadingQuestions={selectedReadingQuestions}
                        selectedListeningQuestions={selectedListeningQuestions}
                        updatedQuestionsAfterRemove={() => {
                          getSkillsQuestions(values?.id);
                        }}
                      />
                    </Tab>
                  )}
                </Tabs>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
                disabled={actionsLoading}
              >
                Close
              </button>
              <> </>
              {selectedTab === "existingQuestionsTab" ||
              selectedTab === "addQuestionsTab" ? null : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-primary btn-elevate"
                  disabled={
                    actionsLoading ||
                    (values.parentNameLevel2?.trim().toLowerCase() ===
                      "learning resources" &&
                      !fileInput)
                  }
                >
                  Save
                </button>
              )}
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}

const CircularProgressWithLabel = ({ value }) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={value} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
};
