// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, Component, useRef, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, withFormik } from "formik";
import { format, parseISO } from "date-fns";
import * as actions from "../_redux/couponsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AddUsersTab from "../components/AddUsersTab";
import Select from "react-select";
import AsyncSelect from "react-select/async";

import AddQuestionsTab from "../components/AddQuestionsTab";
import AddSessionsTab from "../components/AddSessionTab";
import AddMockTestsTab from "../components/AddMockTestsTab";
import AddCoursesTab from "../components/AddCoursesTab";
import AddPackageTab from "../components/AddPackageTab";

import Alert from "@material-ui/lab/Alert";

import {
  attachTagToElement,
  detachTagToElement,
  findTags,
} from "../../../tagService";
import { difference } from "lodash";
import { mergeFunctionWithId } from "../../../utility";

import {
  Input,
  Checkbox,
  Switch,
  Select as SelectAlgorithmType,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";
// import Select from "react-select";

import { useCouponsUIContext } from "../CouponsUIContext";

export function CouponEditForm({ saveCoupon, coupon, actionsLoading, onHide }) {
  const couponsUIContext = useCouponsUIContext();
  const couponsUIProps = useMemo(() => {
    return {
      ids: couponsUIContext.ids,
      setIds: couponsUIContext.setIds,
      queryParams: couponsUIContext.queryParams,
    };
  }, [couponsUIContext]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [packages, setPackages] = useState([]);

  const dispatch = useDispatch();
  const { scope } = useSelector(
    (state) => ({
      scope: state.coupons.scope,
    }),
    shallowEqual
  );

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

  // useEffect(() => {
  //   dispatch(actions.fetchScopes());
  // }, []);

  useEffect(() => {
    console.log("coupon", coupon);

    const { tags, users } = coupon;
  }, [coupon]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={coupon}
        onSubmit={(values) => {
          const newValues = {
            ...values,
            users_tags:
              tags && tags?.length != 0 ? tags?.map((i) => i.label) : [],
            users: users.map((i) => i.id),
            algorithm_type: values.algorithm_type.toLocaleLowerCase(),
            minimum_price: 0,
            billable_type: values.billable_type,
            is_unlimited: values.capacity === 0 ?true:false,
            bills: [
              ...questions,
              ...sessions,
              ...mockTests,
              ...courses,
              ...packages,
            ],
          };
          // if (values.id || values.is_all) delete newValues["scope_id"];

          if (values.algorithm_type.toLocaleLowerCase() == "percentage")
            newValues["percent"] = values.algorithm_data.percent;
          else if (values.algorithm_type.toLocaleLowerCase() == "fixed")
            newValues["amount"] = values.algorithm_data.amount;

          if (scope) newValues["scope_id"] = scope.id;

          saveCoupon(newValues, couponsUIProps.queryParams);
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
                  style={{ zIndex: 10 }}
                >
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <Tabs
                  defaultActiveKey="createCoupon"
                  onSelect={(e) => {
                    dispatch(actions.resetFilteredUsers());
                  }}
                >
                  <Tab eventKey="createCoupon" title="Create Coupon">
                    <div className="form-group row" style={{ marginTop: 30 }}>
                      <div className="col-lg-6">
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
                      <div className="col-lg-6">
                        <Field
                          type="text"
                          name="token"
                          mandatory={true}
                          component={Input}
                          disableValidation={true}
                          placeholder="Token"
                          label="Token"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-6">
                        <SelectAlgorithmType
                          label="Algorithm Type"
                          name="algorithm_type"
                          mandatory={true}
                          onChange={(e) => {
                            const { value } = e.target;
                            setFieldValue("algorithm_type", value);
                            setFieldValue("algorithm_data.percent", 0);
                            setFieldValue("algorithm_data.amount", 0);
                          }}
                        >
                          <option value="Percentage">Percentage</option>
                          <option value="Fixed">Fixed</option>
                        </SelectAlgorithmType>
                      </div>

                      {values.algorithm_type == "Percentage" ? (
                        <div className="col-lg-6">
                          <Field
                            type="number"
                            name="algorithm_data.percent"
                            disableValidation={true}
                            mandatory={true}
                            min="0"
                            max="100"
                            component={Input}
                            placeholder="Percent (%)"
                            label="Percent (%)"
                          />
                        </div>
                      ) : (
                        <div className="col-lg-4">
                          <Field
                            type="number"
                            name="algorithm_data.amount"
                            disableValidation={true}
                            mandatory={true}
                            min="0"
                            component={Input}
                            placeholder="Amount ($)"
                            label="Amount ($)"
                          />
                        </div>
                      )}
                      {/* <div className="col-lg-4">
                        <Field
                          type="number"
                          name="minimum_price"
                          disableValidation={true}
                          mandatory={true}
                          min="0"
                          component={Input}
                          placeholder="Minimum Price ($)"
                          label="Minimum Price ($)"
                        />
                      </div> */}
                    </div>

                    <div className="form-group row">
                      {/* <div className="col-lg-6">
                        <Field
                          name="is_unlimited"
                          component={Switch}
                          mandatory={false}
                          label="Is Unlimited: No/Yes"
                          checked={values.is_unlimited}
                          onChange={(e) => {
                            const { checked } = e.target;
                            setFieldValue("is_unlimited", checked);
                          }}
                        />
                      </div> */}

                      <div className="col-lg-6">
                        <Field
                          type="number"
                          name="capacity"
                          disableValidation={true}
                          mandatory={true}
                          min="0"
                          component={Input}
                          placeholder="Number of times it can be used:"
                          label="Number of times it can be used: (0 means its unlimited.)"
                        />
                      </div>
                      <div className="col-lg-6">
                        <Field
                          name="has_limited_time"
                          component={Switch}
                          mandatory={false}
                          label="Has Limited Time: No/Yes"
                          checked={values.has_limited_time}
                          onChange={(e) => {
                            const { checked } = e.target;
                            setFieldValue("has_limited_time", checked);
                          }}
                        />
                      </div>
                    </div>

                    {values.has_limited_time == true && (
                      <div className="form-group row">
                        <div className="col-lg-6">
                          <DatePickerField
                            name="usable_from"
                            label="Usable From"
                            value={`${format(
                              new Date(values.usable_from),
                              "yyyy-MM-dd"
                            )}  ,  ${format(
                              new Date(values.usable_from),
                              "HH:mm"
                            )}`}
                            captionHide={true}
                            sendDate={(date) => {
                              // console.log("date", date);
                            }}
                            minDate={new Date()}
                            mandatory={true}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="yyyy-MM-dd HH:mm"
                          />
                        </div>
                        <div className="col-lg-6">
                          <DatePickerField
                            name="usable_till"
                            label="Usable Till"
                            value={`${format(
                              new Date(values.usable_till),
                              "yyyy-MM-dd"
                            )}  ,  ${format(
                              new Date(values.usable_till),
                              "HH:mm"
                            )}`}
                            captionHide={true}
                            sendDate={(date) => {
                              // console.log("date", date);
                            }}
                            minDate={new Date(values.usable_from)}
                            mandatory={true}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="yyyy-MM-dd HH:mm"
                          />
                        </div>
                      </div>
                    )}
                    {/* <div className="form-group row">
                      <br />

                      <Alert severity="warning">
                        Attention! Please consider that you are able to set "Is
                        For All" configs only during the coupon creation and it
                        could not be changed in the updating process.
                      </Alert>

                      <br />
                      <div className="col-lg-6">
                        <Field
                          name="is_all"
                          component={Switch}
                          mandatory={false}
                          label="Specific Type/Is For All"
                          disabled={values.id}
                          checked={values.is_all}
                          onChange={(e) => {
                            const { checked } = e.target;
                            setFieldValue("is_all", checked);
                          }}
                        />
                      </div>
                    </div> */}

                    {/* {values.is_all ? null : (
                      <div className="form-group row">
                        {values?.id ? (
                          <>
                            {values?.effects?.data[0]?.effect_type ==
                            "all" ? null : (
                              <div className="col-lg-6">
                                <Field
                                  type="text"
                                  value={values.billable_type}
                                  mandatory={true}
                                  component={Input}
                                  hideEnterTitle={true}
                                  mandatory={false}
                                  disabled={true}
                                  disableValidation={true}
                                  placeholder="Coupon type"
                                  label="Coupon type"
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="col-lg-6">
                            <SelectAlgorithmType
                              name="billable_type"
                              label="Coupon type"
                              onChange={(e) => {
                                const { value } = e.target;
                                setFieldValue("billable_type", value);
                              }}
                            >
                              <option value=""></option>
                              <option value="questions">Questions</option>
                              <option value="mocks">Mock tests</option>
                              <option value="sessions">Sessions</option>
                              <option value="courses">Courses</option>
                              <option value="packages">Packages</option>
                            </SelectAlgorithmType>
                          </div>
                        )}
                      </div>
                    )} */}

                    <div className="form-group row">
                      <div className="col-lg-6">
                        <Field
                          name="is_public"
                          component={Switch}
                          mandatory={false}
                          label="Is Public: No/Yes"
                          // disabled={values.id}
                          checked={values.is_public}
                          onChange={(e) => {
                            const { checked } = e.target;
                            setFieldValue("is_public", checked);
                          }}
                        />
                      </div>
                    </div>
                  </Tab>

                  {!values.is_public ? (
                    <Tab
                      eventKey="addUsers"
                      title="Add Users"
                      disabled={values.is_public}
                    >
                      <AddUsersTab
                        sendUsers={(users) => {
                          setUsers(users);
                        }}
                        sendTags={setTags}
                      />
                    </Tab>
                  ) : null}

                  {!values.is_all && values.billable_type === "questions" && (
                    <Tab eventKey="AddQuestions" title="Questions">
                      <AddQuestionsTab
                        scopeId={scope?.id}
                        comingQuestions={scope?.billables?.question}
                        sendQuestions={setQuestions}
                      />
                    </Tab>
                  )}

                  {!values.is_all && values.billable_type === "sessions" && (
                    <Tab eventKey="addSessions" title="Sessions">
                      <AddSessionsTab
                        scopeId={scope?.id}
                        comingSessions={scope?.billables?.session}
                        sendSessions={setSessions}
                      />
                    </Tab>
                  )}

                  {!values.is_all && values.billable_type === "mocks" && (
                    <Tab eventKey="addMockTests" title="Mock Tests">
                      <AddMockTestsTab
                        scopeId={scope?.id}
                        comingMocks={scope?.billables?.mock}
                        sendMocks={setMockTests}
                      />
                    </Tab>
                  )}

                  {!values.is_all && values.billable_type === "courses" && (
                    <Tab eventKey="addCourses" title="Courses">
                      <AddCoursesTab
                        scopeId={scope?.id}
                        comingCourses={scope?.billables?.course}
                        sendCourses={setCourses}
                      />
                    </Tab>
                  )}

                  {!values.is_all && values.billable_type === "packages" && (
                    <Tab eventKey="addPackages" title="Packages">
                      <AddPackageTab
                        scopeId={scope?.id}
                        comingPackages={scope?.billables?.package}
                        sendPackages={setPackages}
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
              >
                Cancel
              </button>
              <> </>
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary btn-elevate"
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

// {values.is_public ? null : (
//   <>
//     {values.id ? (
//       <div className="form-group row">
//         <div className="col-lg-12">
//           Users id:
//           <ul>
//             {values.users?.map((i) => (
//               <li>
//                 <a href={`/students/${i}/edit`}>{i}</a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     ) : (
//       <div className="form-group row">
//         <div className="col-lg-12">
//           <label>Users</label>
//           <br />
//           <Select
//             value={users}
//             isMulti
//             name="colors"
//             isSearchable={false}
//             className="basic-multi-select"
//             classNamePrefix="select"
//             isClearable={false}
//             onChange={(remainItems) => {
//               const removingTags = difference(
//                 users,
//                 remainItems
//               );
//               // dispatch(
//               //   actions.removeBillFromScope(values.id, [
//               //     removingTags[0].billable_id,
//               //   ])
//               // );

//               setUsers(remainItems);
//             }}
//             noOptionsMessage={(str) =>
//               "To add items, please refer to related tab at the topbar."
//             }
//             placeholder="No items."
//           />
//         </div>
//       </div>
//     )}

//     <div className="form-group row">
//       <div className="col-lg-12">
//         <label>Users with tags:</label>
//         <br />
//         <AsyncSelect
//           isMulti
//           name="tags"
//           isDisabled={values.id ? true : false}
//           cacheOptions
//           defaultOptions
//           loadOptions={promiseTagsOptions}
//           getOptionLabel={(option) =>
//             `${option?.label ? option?.label : ""}`
//           }
//           getOptionValue={(option) => option.value}
//           value={tags}
//           isClearable={false}
//           onChange={(value) => {
//             console.log("valuevalue", value);
//             if (value) setTags(value);
//             else setTags([]);
//           }}
//           // onBlur={() => setFieldTouched("users_tags", true)}
//         />
//       </div>
//     </div>
//   </>
// )}
