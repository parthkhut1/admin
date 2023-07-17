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
import {mergeFunctionWithId} from "../../../utility"


import AddQuestionsTab from "../components/AddQuestionsTab";
import AddSessionsTab from "../components/AddSessionTab";
import AddMockTestsTab from "../components/AddMockTestsTab";
import AddCoursesTab from "../components/AddCoursesTab";

import * as requestFromServer from "../_redux/scopesCrud";

import * as actions from "../_redux/scopesActions";
import {
  Input,
  DatePickerField,
  Switch,
  Select as DropdownSelect,
} from "../../../../_metronic/_partials/controls";
import { findTeacher } from "../_redux/scopesCrud";
import { useScopesUIContext } from "../ScopesUIContext";

import AsyncSelect from "react-select/async";
import Select from "react-select";

import {
  attachTagToElement,
  detachTagToElement,
  findTags,
} from "../../../tagService";
import { difference } from "lodash";
import { useSnackbar } from "notistack";

// Validation schema
const ScopeEditSchema = Yup.object().shape({});

export function ScopeEditForm({ saveScope, scope, actionsLoading, onHide }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const scopesUIContext = useScopesUIContext();
  const [tags, setTags] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [courses, setCourses] = useState([]);

  const scopesUIProps = useMemo(() => {
    return {
      ids: scopesUIContext.ids,
      setIds: scopesUIContext.setIds,
      queryParams: scopesUIContext.queryParams,
    };
  }, [scopesUIContext]);

  const filterTags = async (inputValue) => {
    const {
      data: {
        payload: { data },
      },
    } = await findTags(inputValue);
    const newData = data.map((i) => ({
      id: i.id,
      value: i.name,
      label: i.name,
    }));
    return newData;
  };

  const promiseTagsOptions = (inputValue) =>
    new Promise((resolve) => {
      resolve(filterTags(inputValue));
    });

  useEffect(() => {
    const {
      billables: { question, mock, session, course },
      tags,
      billable_type,
    } = scope;

    if (billable_type === "questions" && question?.length != 0) {
      setQuestions(
        question?.map((q) => ({
          id: q.id,
          billable_id: q.billable_id,
          value: q.title,
          label: q.title,
        }))
      );
    } else setQuestions([]);

    if (billable_type === "mocks" && mock?.length != 0) {
      setMockTests(
        mock?.map((m) => ({
          id: m.id,
          billable_id: m.billable_id,
          value: m.name,
          label: m.name,
        }))
      );
    } else setMockTests([]);

    if (billable_type === "sessions" && session?.length != 0) {
      setSessions(
        session?.map((s) => ({
          id: s.id,
          billable_id: s.billable_id,
          value: s.name,
          label: s.name,
        }))
      );
    } else setSessions([]);

    if (billable_type === "courses" && course?.length != 0) {
      setCourses(
        course?.map((s) => ({
          id: s.id,
          billable_id: s.billable_id,
          value: s.title,
          label: s.title,
        }))
      );
    } else setCourses([]);

    if (tags?.length !== 0)
      setTags(() => tags?.map((i) => ({ value: i, label: i })));
    else setTags([]);
  }, [scope]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={scope}
        validationSchema={ScopeEditSchema}
        onSubmit={(values) => {
          const newValue = {
            ...values,
            tags: tags?.map(i=>i.value),
            billable_type: tags?.length > 0 ? "" : values.billable_type,
          };
          delete newValue["billables"];

          if (values.billable_type == "questions")
            dispatch(
              actions.addBillToScope(
                values.id,
                questions?.map((i) => i.billable_id)
              )
            );
          if (values.billable_type == "sessions")
            dispatch(
              actions.addBillToScope(
                values.id,
                sessions?.map((i) => i.billable_id)
              )
            );
          if (values.billable_type == "mocks")
            dispatch(
              actions.addBillToScope(
                values.id,
                mockTests?.map((i) => i.billable_id)
              )
            );
          if (values.billable_type == "courses")
            dispatch(
              actions.addBillToScope(
                values.id,
                courses?.map((i) => i.billable_id)
              )
            );
          saveScope(newValue, scopesUIProps.queryParams);
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
                  defaultActiveKey="createscope"
                  onSelect={(e) => {
                    dispatch(actions.resetFilteredQuestions());
                    dispatch(actions.resetFilteredMocks());
                    dispatch(actions.resetFilteredSessions());
                    dispatch(actions.resetFilteredCourses());
                  }}
                >
                  <Tab eventKey="createscope" title="Create scope">
                    <div className="form-group row" style={{ marginTop: 40 }}>
                      <div className="col-lg-12">
                        <Field
                          type="text"
                          name="name"
                          mandatory={true}
                          component={Input}
                          disableValidation={true}
                          placeholder="Name"
                          label="Name"
                        />
                      </div>
                    </div>

                    {!values.id && (
                      <span>
                        For adding tags or billables, please first click on save
                        button
                      </span>
                    )}

                    {values.id && (
                      <>
                        {courses?.length > 0 ||
                        mockTests?.length > 0 ||
                        sessions?.length > 0 ||
                        questions?.length > 0 ||
                        values?.billable_type ? null : (
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
                                  if (deletedTag.length != 0) {
                                    dispatch(
                                      actions.removeTagFromScope(values.id, [
                                        deletedTag.pop().label,
                                      ])
                                    );
                                  } else {
                                    dispatch(
                                      actions.addTagToScope(values.id, [
                                        value[value.length - 1].label,
                                      ])
                                    );
                                  }
                                }}
                                onBlur={() => setFieldTouched("tags", true)}
                              />
                            </div>
                          </div>
                        )}
                        {courses?.length > 0 ||
                          mockTests?.length > 0 ||
                          sessions?.length > 0 ||
                          questions?.length > 0 ||
                          (tags?.length > 0 || values?.billable_type ? null : (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 25,
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
                                style={{
                                  border: "1px solid #e4e6ef",
                                  width: "100%",
                                  marginLeft: 12,
                                }}
                              ></div>
                            </div>
                          ))}
                        {tags?.length > 0 ? null : (
                          <div
                            className="form-group row"
                            style={{
                              marginTop: 25,
                            }}
                          >
                            <div className="col-lg-5">
                              <DropdownSelect
                                label="Select category"
                                name="Select billable"
                                disabled={
                                  values?.billable_type &&
                                  (courses?.length > 0 ||
                                    mockTests?.length > 0 ||
                                    sessions?.length > 0 ||
                                    questions?.length > 0)
                                }
                                value={values.billable_type}
                                mandatory={true}
                                onChange={(e) => {
                                  const { value } = e.target;
                                  setFieldValue("billable_type", value);
                                }}
                              >
                                {/* <option value=""></option> */}
                                <option value=""></option>
                                <option value="questions">Question</option>
                                <option value="sessions">Session</option>
                                <option value="mocks">Mock Test</option>
                                <option value="courses">Course</option>
                              </DropdownSelect>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {values.id && values.billable_type === "questions" ? (
                      <div className="form-group row">
                        <div className="col-lg-12">
                          <label>Questions</label>
                          <br />
                          <Select
                            value={questions}
                            isMulti
                            name="colors"
                            isSearchable={false}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(remainItems) => {
                              const removingTags = difference(
                                questions,
                                remainItems
                              );
                              dispatch(
                                actions.removeBillFromScope(values.id, [
                                  removingTags[0].billable_id,
                                ])
                              );
                              setQuestions(remainItems);
                            }}
                            noOptionsMessage={(str) =>
                              "To add items, please refer to related tab at the topbar."
                            }
                            placeholder="No items."
                          />
                        </div>
                      </div>
                    ) : null}

                    {values.id && values.billable_type === "sessions" ? (
                      <div className="form-group row">
                        <div className="col-lg-12">
                          <label>Sessions</label>
                          <br />
                          <Select
                            value={sessions}
                            isMulti
                            name="colors"
                            isSearchable={false}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(remainItems) => {
                              const removingTags = difference(
                                sessions,
                                remainItems
                              );
                              dispatch(
                                actions.removeBillFromScope(values.id, [
                                  removingTags[0].billable_id,
                                ])
                              );

                              setSessions(remainItems);
                            }}
                            noOptionsMessage={(str) =>
                              "To add items, please refer to related tab at the topbar."
                            }
                            placeholder="No items."
                          />
                        </div>
                      </div>
                    ) : null}

                    {values.id && values.billable_type === "mocks" ? (
                      <div className="form-group row">
                        <div className="col-lg-12">
                          <label>Mock Tests</label>
                          <br />
                          <Select
                            value={mockTests}
                            isMulti
                            name="colors"
                            isSearchable={false}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(remainItems) => {
                              const removingTags = difference(
                                mockTests,
                                remainItems
                              );
                              dispatch(
                                actions.removeBillFromScope(values.id, [
                                  removingTags[0].billable_id,
                                ])
                              );

                              setMockTests(remainItems);
                            }}
                            noOptionsMessage={(str) =>
                              "To add items, please refer to related tab at the topbar."
                            }
                            placeholder="No items."
                          />
                        </div>
                      </div>
                    ) : null}
                    {values.id && values.billable_type === "courses" ? (
                      <div className="form-group row">
                        <div className="col-lg-12">
                          <label>Course</label>
                          <br />
                          <Select
                            value={courses}
                            isMulti
                            name="colors"
                            isSearchable={false}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(remainItems) => {
                              const removingTags = difference(
                                courses,
                                remainItems
                              );
                              dispatch(
                                actions.removeBillFromScope(values.id, [
                                  removingTags[0].billable_id,
                                ])
                              );

                              setCourses(remainItems);
                            }}
                            noOptionsMessage={(str) =>
                              "To add items, please refer to related tab at the topbar."
                            }
                            placeholder="No items."
                          />
                        </div>
                      </div>
                    ) : null}
                  </Tab>
                  {values.id && values.billable_type === "questions" && (
                    <Tab eventKey="addQuestions" title="Add Questions">
                      <AddQuestionsTab
                        sendQuestions={(questions) => {
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
                          // dispatch(
                          //   actions.addBillToScope(
                          //     values.id,
                          //     addTags.map((i) => i.billable_id)
                          //   )
                          // );
                        }}
                      />
                    </Tab>
                  )}
                  {values.id && values.billable_type === "sessions" && (
                    <Tab eventKey="addSessions" title="Add Sessions">
                      <AddSessionsTab
                        sendSessions={(sessions) => {
                          const addTags = sessions.map((i) => ({
                            id: i.id,
                            billable_id: i.billable_id,
                            value: i.name,
                            label: i.name,
                          }));
                          setSessions((prev) => {
                            if (prev) return mergeFunctionWithId([...prev, ...addTags]);
                            else return [...addTags];
                          });
                          // dispatch(
                          //   actions.addBillToScope(
                          //     values.id,
                          //     addTags.map((i) => i.billable_id)
                          //   )
                          // );
                        }}
                      />
                    </Tab>
                  )}
                  {values.id && values.billable_type === "mocks" && (
                    <Tab eventKey="addMockTests" title="Add Mock Tests">
                      <AddMockTestsTab
                        sendMockTests={(mockTests) => {
                          const addTags = mockTests.map((i) => ({
                            id: i.id,
                            billable_id: i.billable_id,
                            value: i.name,
                            label: i.name,
                          }));
                          setMockTests((prev) => {
                            if (prev) return mergeFunctionWithId([...prev, ...addTags]);
                            else return [...addTags];
                          });
                          // dispatch(
                          //   actions.addBillToScope(
                          //     values.id,
                          //     addTags.map((i) => i.billable_id)
                          //   )
                          // );
                        }}
                      />
                    </Tab>
                  )}
                  {values.id && values.billable_type === "courses" && (
                    <Tab eventKey="addCourses" title="Add Courses">
                      <AddCoursesTab
                        sendCourses={(courses) => {
                          const addTags = courses.map((i) => ({
                            id: i.id,
                            billable_id: i.billable_id,
                            value: i.title,
                            label: i.title,
                          }));
                          setCourses((prev) => {
                            if (prev) return mergeFunctionWithId([...prev, ...addTags]);
                            else return [...addTags];
                          });
                          // dispatch(
                          //   actions.addBillToScope(
                          //     values.id,
                          //     addTags.map((i) => i.billable_id)
                          //   )
                          // );
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
