// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";
import FrequentlyAskedQuestion from "../components/frequentlyAskedQuestion";

import "react-quill/dist/quill.snow.css";
import "./quillStyle.css";

import * as Yup from "yup";
import { format, parseISO } from "date-fns";
import {
  Input,
  DatePickerField,
  Switch,
  Textarea,
  Select,
} from "../../../../_metronic/_partials/controls";
import { findTeacher } from "../_redux/tutorialsCrud";
import { useTutorialsUIContext } from "../TutorialsUIContext";

import AsyncSelect from "react-select/async";
import { difference } from "lodash";
import AddQuestionsTab from "../components/AddQuestionsTab";

import ReactQuill, { Quill } from "react-quill";
import axios from "axios";

// #1 import quill-image-uploader
import ImageUploader from "quill-image-uploader";

// #2 register module
Quill.register("modules/imageUploader", ImageUploader);

// Validation schema
const tutorialEditSchema = Yup.object().shape({});

const useStyles = makeStyles((theme) => ({
  questionInfo: {
    marginLeft: theme.spacing(1),
  },
  questionText: {
    lineHeight: 2,
  },
}));

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

export function TutorialEditForm({
  saveTutorial,
  tutorial,
  actionsLoading,
  onHide,
}) {
  const tutorialsUIContext = useTutorialsUIContext();
  const tutorialsUIProps = useMemo(() => {
    return {
      ids: tutorialsUIContext.ids,
      setIds: tutorialsUIContext.setIds,
      queryParams: tutorialsUIContext.queryParams,
    };
  }, [tutorialsUIContext]);

  const classes = useStyles();
  const [value, setValue] = useState("");
  const [sampleQuestion, setSampleQuestion] = useState([]);
  const [activeTab, setActiveTab] = useState("createTutorial");

  // tutorials Redux state
  const dispatch = useDispatch();
  const { posts } = useSelector(
    (state) => ({
      posts: state.tutorials.posts,
    }),
    shallowEqual
  );

  useEffect(() => {
    // console.log("tutorial", tutorial);
    if (tutorial?.text) setValue(tutorial?.text);
  }, [tutorial]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={tutorial}
        validationSchema={tutorialEditSchema}
        onSubmit={(values) => {
          const newValues = {
            ...values,
            text: value,
            question_id: sampleQuestion[0]?.id,
            // is_featured: 1,
          };
          saveTutorial(newValues, tutorialsUIProps.queryParams);
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
                  defaultActiveKey="createTutorial"
                  onSelect={(e) => {
                    setActiveTab(e);
                  }}
                >
                  <Tab eventKey="createTutorial" title="Create Tutorial">
                    <div
                      className="form-group row"
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <div className="col-lg-12">
                        {/* <Field
                          type="text"
                          name="name"
                          mandatory={true}
                          component={Input}
                          disableValidation={true}
                          placeholder="Question type"
                          label="Question type"
                        /> */}
                        <Select
                          label="Question Type"
                          value={values.name}
                          mandatory={false}
                          onChange={(e) => {
                            const { value } = e.target;
                            setFieldValue("name", value);
                          }}
                        >
                          <option value=""></option>
                          <optgroup label="Speaking">
                            <option value="Speaking-ReadAloud-RA">
                              Read Aloud
                            </option>
                            <option value="Speaking-RepeatSentence-RS">
                              Repeat Sentence
                            </option>
                            <option value="Speaking-DescribeImage-DI">
                              Describe Image
                            </option>
                            <option value="Speaking-RetellLecture-RL">
                              Retell Lecture
                            </option>
                            <option value="Speaking-AnswerShortQuestion-ASQ">
                              Answer Short Question
                            </option>
                          </optgroup>
                          <optgroup label="Writing">
                            <option value="Writing-SummarizeWrittenText-SWT">
                              Summarize Written Text
                            </option>
                            <option value="Writing-WriteEssay-WE">
                              Write Essay
                            </option>
                          </optgroup>
                          <optgroup label="Reading">
                            <option value="Reading-ReadingMultipleChoiceSingleAnswer-MCS">
                              Multiple Choice(Single)
                            </option>
                            <option value="Reading-ReadingMultipleChoiceMultipleAnswer-MCM">
                              Multiple Choice(Multiple)
                            </option>
                            <option value="Reading-ReorderParagraph-ROP">
                              Reorder Paragraph
                            </option>
                            <option value="Reading-ReadingFillInTheBlanks-RFIB">
                              R-Fill In The Blanks
                            </option>
                            <option value="Reading-ReadingAndWritingFillInTheBlanks-FIB">
                              RW-Fill In The Blanks
                            </option>
                          </optgroup>
                          <optgroup label="Listening">
                            <option value="Listening-SummarizeSpokenText-SST">
                              Summarize Spoken Text
                            </option>
                            <option value="Listening-ListeningMultipleChoiceSingleAnswer-MCS">
                              Multiple Choice(single)
                            </option>
                            <option value="Listening-ListeningMultipleChoiceMultipleAnswer-MCM">
                              Multiple Choice(multiple)
                            </option>
                            <option value="Listening-ListeningFillInTheBlanks-FIB">
                              Fill In The Blanks
                            </option>
                            <option value="Listening-HighlightCorrectSummary-HCS">
                              Highlight Correct Summary
                            </option>
                            <option value="Listening-SelectMissingWord-SMW">
                              Select Missing Word
                            </option>
                            <option value="ListeningHighlightIncorrectWords-HIW">
                              Highlight Incorrect Words
                            </option>
                            <option value="Listening-WriteFromDictation-WFD">
                              Write From Dictation
                            </option>
                          </optgroup>
                        </Select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-12">
                        <Field
                          type="text"
                          name="title"
                          mandatory={true}
                          component={Input}
                          disableValidation={true}
                          placeholder="Post Title"
                          label="Post Title"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-12">
                        <label>Enter Post Text</label>
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

                    {tutorial?.question ? (
                      <>
                        <div className="form-group row">
                          <div className={`col-lg-4`}>
                            <label>Sample Question</label>
                            <span style={{ color: "red", marginTop: 40 }}>
                              {" "}
                              *
                            </span>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className={`col-lg-4`}>
                            <Typography variant="overline">
                              Question type:{" "}
                            </Typography>
                            <Typography
                              variant="button"
                              className={classes.questionInfo}
                            >
                              {`${tutorial?.question?.question_name}`}{" "}
                            </Typography>
                          </div>
                          <div className={`col-lg-4`}>
                            <Typography variant="overline">
                              Question title:
                            </Typography>
                            <Typography
                              variant="button"
                              className={classes.questionInfo}
                            >
                              {tutorial?.question?.title}{" "}
                            </Typography>
                          </div>
                          <div className={`col-lg-4`}>
                            <Typography variant="overline">
                              Difficulty level:
                            </Typography>
                            <Typography
                              variant="button"
                              className={classes.questionInfo}
                            >
                              {tutorial?.question?.difficulty}
                            </Typography>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-lg-12">
                            <label>See Question:</label>
                            <Button
                              variant="link"
                              onClick={() => {
                                window.open(
                                  `/${tutorial?.question?.category.toLowerCase()}/${tutorial?.question?.question_name
                                    .toLowerCase()
                                    .split(" ")
                                    .join("-")}/${tutorial?.question.id}/edit`
                                );
                              }}
                            >
                              Go to question page
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </Tab>
                  <Tab eventKey="addQuestion" title="Add Question">
                    <div className="form-group row" style={{ marginTop: 40 }}>
                      <div className="col-lg-12">
                        <label>Add Sample Question</label>
                        <span style={{ color: "red" }}> *</span>
                        <AddQuestionsTab
                          commingQuestionType={values.name}
                          sendQuestions={(q) => {
                            setSampleQuestion(q);
                          }}
                        />
                      </div>
                    </div>
                  </Tab>

                  <Tab
                    eventKey="frequentlyAskedQuestion"
                    title="Frequently Asked Question"
                  >
                    <FrequentlyAskedQuestion
                      tutorial={values}
                      disabled={values?.category?.id ? true : false}
                    />
                  </Tab>
                </Tabs>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {activeTab === "createTutorial" ? (
                <>
                  <button
                    type="button"
                    onClick={onHide}
                    className="btn btn-light btn-elevate"
                    disabled={actionsLoading}
                  >
                    Close
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
                </>
              ) : null}
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
