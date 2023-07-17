// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, useEffect, useState } from "react";
import * as requestFromServer from "../_redux/packagesCrud";

import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { uniqBy } from "lodash";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import AddQuestionsTab from "../components/AddQuestionsTab";
import AddSessionsTab from "../components/AddSessionTab";
import AddMockTestsTab from "../components/AddMockTestsTab";
import AddCoursesTab from "../components/AddCoursesTab";
import AddBillByTagTab from "../components/AddBillByTagTab";
import AddAssistantsTab from "../components/AddAssistantsTab";
import UserPackageTab from "../components/UserPackageTab";

import * as actions from "../_redux/packagesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { format, parseISO } from "date-fns";
import {
  Input,
  DatePickerField,
  Switch,
  Select,
  AddOption,
} from "../../../../_metronic/_partials/controls";

import AsyncSelect from "react-select/async";
import {
  attachTagToElement,
  detachTagToElement,
  findTags,
} from "../../../tagService";
import { difference } from "lodash";

import { usePackagesUIContext } from "../PackagesUIContext";
import GenerateRandomPackage from "../components/RandomGenerate";

// Validation schema
const PackageEditSchema = Yup.object().shape({});

export function PackageEditForm({
  savePackage,
  dynamicPackage,
  actionsLoading,
  onHide,
}) {
  const packagesUIContext = usePackagesUIContext();
  const packagesUIProps = useMemo(() => {
    return {
      ids: packagesUIContext.ids,
      setIds: packagesUIContext.setIds,
      queryParams: packagesUIContext.queryParams,
    };
  }, [packagesUIContext]);
  // mockTests Redux state
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [rules, setRules] = useState([]);

  const [tags, setTags] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [courses, setCourses] = useState([]);

  const [questionsLimitation, setQuestionsLimitation] = useState(0);
  const [sessionsLimitation, setSessionsLimitation] = useState(0);
  const [mockTestsLimitation, setMockTestsLimitation] = useState(0);
  const [coursesLimitation, setCoursesLimitation] = useState(0);

  const [page, setPage] = useState(1);

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
    const { scopes, id } = dynamicPackage;

    setOptions(() => {
      return dynamicPackage.description?.map((opt) => opt.message)
        ? dynamicPackage.description?.map((opt) => opt.message)
        : [];
    });

    setAnswer(() => {
      return dynamicPackage.description?.map((opt) =>
        opt.included ? opt.message : ""
      )
        ? dynamicPackage.description?.map((opt) =>
            opt.included ? opt.message : ""
          )
        : [];
    });

    if (dynamicPackage.tags?.length !== 0)
      setTags(() => dynamicPackage.tags?.map((i) => ({ value: i, label: i })));
    else setTags([]);

    dispatch(actions.fetchAssistantsScopes());
    if (id) dispatch(actions.fetchUserPackagesList(id, page));
  }, [dynamicPackage]);

  useEffect(() => {
    if (dynamicPackage?.id)
      dispatch(actions.fetchUserPackagesList(dynamicPackage?.id, page));
  }, [page]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={dynamicPackage}
        validationSchema={PackageEditSchema}
        onSubmit={(values) => {
          const newDesc = options.map((opt) => ({
            message: opt,
            included: answer.find((ans) => ans === opt) ? true : false,
          }));

          const newValues = {
            ...values,
            description: newDesc,
            rules: uniqBy(rules, "scope_id"),
            courses,
            mocks: mockTests,
            sessions,
            questions,

            sessionsLimitation: sessionsLimitation ? +sessionsLimitation : 0,
            questionsLimitation: questionsLimitation ? +questionsLimitation : 0,
            mockTestsLimitation: mockTestsLimitation ? +mockTestsLimitation : 0,
            coursesLimitation: coursesLimitation ? +coursesLimitation : 0,
          };
          savePackage(newValues, packagesUIProps.queryParams);
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
                  defaultActiveKey="createPackage"
                  onSelect={(e) => {
                    dispatch(actions.resetFilteredQuestions());
                    dispatch(actions.resetFilteredMocks());
                    dispatch(actions.resetFilteredSessions());
                    dispatch(actions.resetFilteredCourses());
                  }}
                >
                  <Tab eventKey="createPackage" title="Package">
                    <div className="form-group row" style={{ marginTop: 20 }}>
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

                    <div className="form-group row">
                      <div className="col-lg-5">
                        <Field
                          type="number"
                          name="price"
                          disableValidation={true}
                          min="1"
                          component={Input}
                          placeholder="Price ($)"
                          label="Price ($)"
                        />
                      </div>
                      <div className="col-lg-5">
                        <Field
                          type="number"
                          name="duration"
                          disableValidation={true}
                          min="1"
                          component={Input}
                          placeholder="Duration (day)"
                          label="Duration (days)"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-5">
                        <Field
                          type="number"
                          name="ai_count"
                          disableValidation={true}
                          min="1"
                          component={Input}
                          placeholder="AI count"
                          label="AI count"
                        />
                      </div>
                      <div className="col-lg-5">
                        <Field
                          name="is_ai_count_refreshable"
                          component={Switch}
                          label="Is daily refreshable: No/Yes"
                          checked={values.is_ai_count_refreshable}
                          onChange={(e) => {
                            setFieldValue(
                              "is_ai_count_refreshable",
                              e.target.checked
                            );
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
                                  "packages",
                                  values.id
                                ).then((res) => {
                                  dispatch(
                                    actions.fetchPackages(
                                      packagesUIProps.queryParams
                                    )
                                  );
                                });
                              else
                                attachTagToElement(
                                  value[value.length - 1].label,
                                  "packages",
                                  values.id
                                ).then((res) => {
                                  dispatch(
                                    actions.fetchPackages(
                                      packagesUIProps.queryParams
                                    )
                                  );
                                });
                            }}
                            onBlur={() => setFieldTouched("tags", true)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          margin: "30px 0px",
                        }}
                      >
                        For adding tags, please first click on save button
                      </div>
                    )}

                    {/* <div className="form-group row">
                      <div className="col-lg-12">
                        <Field
                          name="is_recommended"
                          component={Switch}
                          label="Is recommended: No/Yes"
                          subLabel="Recommended packages will be shown with different color"
                          checked={values.is_recommended}
                          onChange={(e) => {
                            setFieldValue("is_recommended", e.target.checked);
                          }}
                        />
                      </div>
                    </div> */}
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <Field
                          name="is_base"
                          component={Switch}
                          label="Is Main Package: No/Yes"
                          subLabel="Main packages will be shown in the first row"
                          checked={values.is_base}
                          onChange={(e) => {
                            setFieldValue("is_base", e.target.checked);
                          }}
                        />
                      </div>
                    </div>
                    {/* <div className="form-group row">
                      <div className="col-lg-12">
                        <Field
                          name="type"
                          component={Switch}
                          label="Type: Subscription/Package"
                          disabled={values.id}
                          checked={
                            values.id && values.scopes?.length != 1
                              ? true
                              : values.type
                          }
                          onChange={(e) => {
                            setFieldValue("type", e.target.checked);
                          }}
                        />
                      </div>
                    </div> */}

                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div style={{ paddingBottom: "5px" }}>
                          Enter package detail line by line
                          <span style={{ color: "red" }}> * </span>
                        </div>
                        <Field
                          name="option"
                          component={AddOption}
                          label="Line"
                          answer={answer}
                          options={options}
                          hasMultiAnswers={true}
                          inputType="checkbox"
                          onAddOption={(option) => {
                            if (option && !options?.find((i) => i == option))
                              setOptions((opts) => [...opts, option]);
                          }}
                          onRemoveOption={(option) => {
                            const newOptions = options.filter(
                              (opt) => opt !== option
                            );
                            setOptions(newOptions);
                            const existAnswer = answer.find(
                              (ans) => ans === option
                            );
                            if (existAnswer)
                              setAnswer((prev) =>
                                prev.filter((ans) => ans !== option)
                              );
                          }}
                          onUpdateAnswer={(updatedText, index) => {
                            setOptions((prev) => {
                              const newOpt = [...prev];
                              newOpt[index] = updatedText;
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
                  </Tab>
                  {(!values.id && values.type) ||
                  (values.id && values.scopes?.length != 1) ? (
                    <Tab eventKey="AddQuestions" title="Questions">
                      <AddQuestionsTab
                        scopeId={
                          values?.scopes?.find(
                            (i) => i?.scope?.billable_type == "questions"
                          )?.scope.id
                        }
                        comingQuestions={
                          values?.billables?.find((i) => i.type == "questions")
                            ?.question
                        }
                        sendQuestions={setQuestions}
                        packageId={values.id}
                        sendQuestionLimitation={setQuestionsLimitation}
                        comingPackage={dynamicPackage}
                      />
                    </Tab>
                  ) : null}

                  {(!values.id && values.type) ||
                  (values.id && values.scopes?.length != 1) ? (
                    <Tab eventKey="addSessions" title="Sessions">
                      <AddSessionsTab
                        scopeId={
                          values?.scopes?.find(
                            (i) => i?.scope?.billable_type == "sessions"
                          )?.scope.id
                        }
                        comingSessions={
                          values?.billables?.find((i) => i.type == "sessions")
                            ?.session
                        }
                        sendSessions={setSessions}
                        packageId={values.id}
                        sendSessionLimitation={setSessionsLimitation}
                        comingPackage={dynamicPackage}
                      />
                    </Tab>
                  ) : null}

                  <Tab eventKey="addMockTests" title="Mock Tests">
                    <AddMockTestsTab
                      scopeId={
                        values?.scopes?.find(
                          (i) => i?.scope?.billable_type == "mocks"
                        )?.scope.id
                      }
                      comingMocks={
                        values?.billables?.find((i) => i.type == "mocks")?.mock
                      }
                      sendMocks={setMockTests}
                      packageId={values.id}
                      sendMockTestLimitation={setMockTestsLimitation}
                      comingPackage={dynamicPackage}
                    />
                  </Tab>
                  {(!values.id && values.type) ||
                  (values.id && values.scopes?.length != 1) ? (
                    <Tab eventKey="addCourses" title="Courses">
                      <AddCoursesTab
                        scopeId={
                          values?.scopes?.find(
                            (i) => i?.scope?.billable_type == "courses"
                          )?.scope.id
                        }
                        comingCourses={
                          values?.billables?.find((i) => i.type == "courses")
                            ?.course
                        }
                        sendCourses={setCourses}
                        packageId={values.id}
                        sendCourseLimitation={setCoursesLimitation}
                        comingPackage={dynamicPackage}
                      />
                    </Tab>
                  ) : null}

                  {(!values.id && values.type) ||
                  (values.id && values.scopes?.length != 1) ? (
                    <Tab eventKey="addAssistants" title="Assistants">
                      <AddAssistantsTab
                        packageId={values.id}
                        sendRules={setRules}
                        commigAssis={values?.scopes?.filter(
                          (i) => i.scope.billable_type == "assistants"
                        )}
                      />
                    </Tab>
                  ) : null}

                  <Tab eventKey="usersList" title="Users List">
                    <UserPackageTab packageId={values.id}/>
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
