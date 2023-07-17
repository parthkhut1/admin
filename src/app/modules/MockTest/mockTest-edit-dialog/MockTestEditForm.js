// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, Component, useRef, useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import InputLabel from "@material-ui/core/InputLabel";
import { Formik, Form, Field, withFormik } from "formik";
import ExistingQuestionsTab from "../components/ExistingQuestionsTab";
import AddQuestionsTab from "../components/AddQuestionsTab";
import SortQuestionsTab from "../components/SortQuestionsTab";
import * as requestFromServer from "./../_redux/mockTestsCrud";
import GenerateRandomMockTest from "./../components/RandomGenerate";
import { format } from "date-fns";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/mockTestsActions";

import {
  attachTagToElement,
  detachTagToElement,
  findTags,
} from "../../../tagService";
import AsyncSelect from "react-select/async";
import { difference } from "lodash";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import {
  Input,
  Select,
  Switch,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";

import { useMockTestsUIContext } from "../MockTestsUIContext";
import produce from "immer";
import { getUTCDate } from "../../../utility";

export function MockTestEditForm({
  saveMockTest,
  mockTest,
  actionsLoading,
  onHide,
}) {
  const [randomQuestions, setRandomQuestions] = useState([]);

  const [selectedTab, setSelectedTab] = useState("");
  const [isRandomMockTest, setIsRandomMockTest] = useState(false);
  const [publishedAtState, setPublishedAtState] = useState(false);
  const [tags, setTags] = useState([]);

  const [selectedSpeakingQuestions, setSelectedSpeakingQuestions] = useState(
    []
  );
  const [selectedWritingQuestions, setSelectedWritingQuestions] = useState([]);
  const [selectedReadingQuestions, setSelectedReadingQuestions] = useState([]);
  const [selectedListeningQuestions, setSelectedListeningQuestions] = useState(
    []
  );

  // mockTests Redux state
  const dispatch = useDispatch();
  const { questions } = useSelector(
    (state) => ({
      questions: state.mockTests.questions,
    }),
    shallowEqual
  );

  const getSkillsQuestions = (mockTestId) => {
    getSpeakingQuestions(questions);
    getWritingQuestions(questions);
    getReadingQuestions(questions);
    getListeningQuestions(questions);

    // requestFromServer
    //   .getSkillsQuestions(mockTestId)
    //   .then((response) => {
    //     const {
    //       payload: { data: mockTestQuestions },
    //     } = response.data;
    //     getSpeakingQuestions(mockTestQuestions);
    //     getWritingQuestions(mockTestQuestions);
    //     getReadingQuestions(mockTestQuestions);
    //     getListeningQuestions(mockTestQuestions);
    //   })
    //   .catch((error) => {
    //     throw error;
    //   });
  };

  const getSpeakingQuestions = (questions) => {
    setSelectedSpeakingQuestions(
      questions.filter((qu) => qu.category === "Speaking")
    );
  };

  const getWritingQuestions = (questions) => {
    setSelectedWritingQuestions(
      questions.filter((qu) => qu.category === "Writing")
    );
  };
  const getReadingQuestions = (questions) => {
    setSelectedReadingQuestions(
      questions.filter((qu) => qu.category === "Reading")
    );
  };
  const getListeningQuestions = (questions) => {
    setSelectedListeningQuestions(
      questions.filter((qu) => qu.category === "Listening")
    );
  };

  const mockTestsUIContext = useMockTestsUIContext();
  const mockTestsUIProps = useMemo(() => {
    return {
      ids: mockTestsUIContext.ids,
      setIds: mockTestsUIContext.setIds,
      queryParams: mockTestsUIContext.queryParams,
    };
  }, [mockTestsUIContext]);

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
    const { published_at, tags } = mockTest;
    if (published_at) setPublishedAtState(true);
    else setPublishedAtState(false);

    if (tags?.length !== 0)
      setTags(() => tags?.map((i) => ({ value: i, label: i })));
    else setTags([]);
    dispatch(actions.getMockTestQuestions(mockTest.id));
  }, [mockTest]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={mockTest}
        onSubmit={(values) => {
          const newValue = {
            ...values,
            types: randomQuestions.reduce((state, cur) => {
              if (state[cur.type])
                state[cur.type] = {
                  ...state[cur.type],
                  [cur.difficulty]: parseInt(cur.count, 10),
                };
              else
                state[cur.type] = { [cur.difficulty]: parseInt(cur.count, 10) };
              return state;
            }, {}),
          };

          console.log("newValue", newValue);
          saveMockTest(newValue, mockTestsUIProps.queryParams);
        }}
      >
        {({
          values,
          touched,
          dirty,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div
                  className="overlay-layer bg-transparent"
                  style={{ zIndex: 2 }}
                >
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <Tabs
                  defaultActiveKey="createMockTest"
                  onSelect={(e) => {
                    setSelectedTab(e);
                    if (values.id && e === "existingQuestionsTab")
                      getSkillsQuestions(values.id, e);
                  }}
                >
                  <Tab eventKey="createMockTest" title="Create Mock Test">
                    <div
                      className="form-group row"
                      style={{ marginTop: "30px" }}
                    >
                      <div className="col-lg-12">
                        <Field
                          name="name"
                          disableValidation={true}
                          component={Input}
                          placeholder="Title"
                          mandatory={true}
                          label="Title"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-3">
                        <Field
                          min="1"
                          type="number"
                          disableValidation={true}
                          name="durations.speaking"
                          component={Input}
                          mandatory={true}
                          placeholder="Speaking duration (minute)"
                          label="Speaking duration (minute)"
                        />
                      </div>
                      <div className="col-lg-3">
                        <Field
                          min="1"
                          type="number"
                          disableValidation={true}
                          name="durations.writing"
                          component={Input}
                          mandatory={true}
                          placeholder="Writing duration (minute)"
                          label="Writing duration (minute)"
                        />
                      </div>
                      <div className="col-lg-3">
                        <Field
                          min="1"
                          type="number"
                          disableValidation={true}
                          name="durations.reading"
                          component={Input}
                          mandatory={true}
                          placeholder="Reading duration (minute)"
                          label="Reading duration (minute)"
                        />
                      </div>
                      <div className="col-lg-3">
                        <Field
                          min="1"
                          type="number"
                          disableValidation={true}
                          name="durations.listening"
                          component={Input}
                          mandatory={true}
                          placeholder="Listening duration (minute)"
                          label="Listening duration (minute)"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-6">
                        <Field
                          min="1"
                          type="number"
                          disableValidation={true}
                          component={Input}
                          hideEnterTitle={true}
                          value={
                            values.durations.speaking +
                            values.durations.writing +
                            values.durations.reading +
                            values.durations.listening
                          }
                          placeholder="Total duration (minute)"
                          label="Total duration (minute)"
                          disabled
                        />
                      </div>
                      <div className="col-lg-6">
                        <DatePickerField
                          name="valid_till"
                          label="Valid till"
                          value={getUTCDate(
                            values.valid_till
                          ).toLocaleDateString()}
                          dateFormat="yyyy-MM-dd"
                          captionHide={true}
                          mandatory={true}
                          sendDate={(date) => {
                            // console.log("date", date);
                          }}
                        />
                      </div>
                    </div>
                    {values.id ? (
                      <div className="form-group row">
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
                                  "mocks",
                                  values.id
                                ).then((res) => {
                                  dispatch(
                                    actions.fetchMockTests(
                                      mockTestsUIProps.queryParams
                                    )
                                  );
                                });
                              else
                                attachTagToElement(
                                  value[value.length - 1].label,
                                  "mocks",
                                  values.id
                                ).then((res) => {
                                  dispatch(
                                    actions.fetchMockTests(
                                      mockTestsUIProps.queryParams
                                    )
                                  );
                                });
                            }}
                            onBlur={() => setFieldTouched("tags", true)}
                          />
                        </div>
                      </div>
                    ) : (
                      "For adding tags, please first click on save button"
                    )}

                    <div className="form-group row">
                      {/* <div className="col-lg-4">
                        <Field
                          component={Switch}
                          label="Is Free: No/Yes"
                          mandatory={false}
                          checked={values.is_free ? true : false}
                          onChange={(e) => {
                            const { checked } = e.target;
                            if (checked)
                              setFieldValue(
                                "is_free",
                                getUTCDate(new Date()).toLocaleDateString()
                              );
                            else setFieldValue("is_free", null);
                          }}
                        />
                      </div> */}
                      {values.id && (
                        <div className="col-lg-4">
                          <Field
                            component={Switch}
                            label="Publish"
                            mandatory={false}
                            checked={values.published_at ? true : false}
                            onChange={(e) => {
                              const { checked } = e.target;
                              if (checked)
                                setFieldValue(
                                  "published_at",
                                  getUTCDate(new Date()).toLocaleDateString()
                                );
                              else setFieldValue("published_at", null);
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {!values.id && (
                      <>
                        <Field
                          component={Switch}
                          label="Automatic generator (you are able to generat mock test automatically just now.)"
                          mandatory={false}
                          checked={isRandomMockTest}
                          onChange={(e) => {
                            const { checked } = e.target;
                            setIsRandomMockTest(checked);
                          }}
                        />
                        {isRandomMockTest && (
                          <GenerateRandomMockTest
                            randomQuestions={randomQuestions}
                            onAddNewItem={(item) => {
                              setRandomQuestions((prev) =>
                                produce(prev, (draft) => {
                                  draft.push(item);
                                })
                              );
                            }}
                            onChange={(q) => {
                              setRandomQuestions((prev) =>
                                produce(prev, (draft) => {
                                  const itemIndex = draft.findIndex(
                                    (i) => i.id === q.id
                                  );
                                  if (itemIndex === -1) draft.push(q);
                                  else {
                                    draft[itemIndex].type = q.type;
                                    draft[itemIndex].difficulty = q.difficulty;
                                    draft[itemIndex].count = q.count;
                                  }
                                })
                              );
                            }}
                            onEditItem={(q) => {
                              setRandomQuestions((prev) =>
                                produce(prev, (draft) => {
                                  const itemIndex = draft.findIndex(
                                    (i) => i.id === q.id
                                  );
                                  draft[itemIndex].isDisabled = !draft[
                                    itemIndex
                                  ].isDisabled;
                                })
                              );
                            }}
                          />
                        )}
                      </>
                    )}
                  </Tab>
                  <Tab
                    eventKey="addQuestionsTab"
                    title="Add Questions"
                    disabled={values.id ? false : true}
                  >
                    <AddQuestionsTab mockTestId={values?.id} />
                  </Tab>
                  <Tab
                    eventKey="existingQuestionsTab"
                    title="Existing Questions"
                    disabled={values.id ? false : true}
                  >
                    <ExistingQuestionsTab
                      mockTestId={values?.id}
                      selectedSpeakingQuestions={selectedSpeakingQuestions}
                      selectedWritingQuestions={selectedWritingQuestions}
                      selectedReadingQuestions={selectedReadingQuestions}
                      selectedListeningQuestions={selectedListeningQuestions}
                      updatedQuestionsAfterRemove={() => {
                        getSkillsQuestions(values?.id);
                      }}
                    />
                  </Tab>
                  <Tab
                    eventKey="sortQuestionsTab"
                    title="Sorting Questions"
                    disabled={values.id ? false : true}
                  >
                    <SortQuestionsTab mockTestId={values?.id} />
                  </Tab>
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
                Cancel
              </button>
              <> </>
              {selectedTab === "existingQuestionsTab" ||
              selectedTab === "addQuestionsTab" ? null : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-primary btn-elevate"
                  disabled={actionsLoading}
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
