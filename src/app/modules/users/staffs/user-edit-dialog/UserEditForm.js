// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Input,
  Select,
  Switch,
} from "../../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/usersActions";
import { useUsersUIContext } from "../UsersUIContext";

import AsyncSelect from "react-select/async";
import {
  attachTagToElement,
  detachTagToElement,
  findTags,
} from "../../../../tagService";
import { difference } from "lodash";

// Validation schema
const UserEditSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols"),
  // email: Yup.string()
  // .email("Invalid email")
  // .required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 symbols")
    .max(50, "Maximum 50 symbols"),
  email: Yup.string().email("Invalid email"),

  // userName: Yup.string().required("Username is required"),
  // dateOfBbirth: Yup.mixed()
  //   .nullable(false)
  //   .required("Date of Birth is required"),
  // ipAddress: Yup.string().required("IP Address is required"),
});

const baseRoles = ["admin", "teacher", "ticket-agent"];

export function UserEditForm({ saveUser, user, actionsLoading, onHide }) {
  const usersUIContext = useUsersUIContext();
  const dispatch = useDispatch();
  const usersUIProps = useMemo(() => {
    return {
      ids: usersUIContext.ids,
      setIds: usersUIContext.setIds,
      queryParams: usersUIContext.queryParams,
    };
  }, [usersUIContext]);
  const [tags, setTags] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [isChangeEmail, setIsChangeEmail] = useState(false);

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
    console.log("userRoles", userRoles);
  }, [userRoles]);

  useEffect(() => {
    const { tags } = user;
    if (tags?.length !== 0)
      setTags(() => tags?.map((i) => ({ value: i, label: i })));
    else setTags([]);

    if (user && user.roles) setUserRoles(user.roles);
  }, [user]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={UserEditSchema}
        onSubmit={(values) => {
          const newValuse = {
            ...values,
            roles: Array.isArray(values.roles)
              ? [...values.roles]
              : values.roles.split(),
          };
          if (values.id && !isChangeEmail) delete newValuse["email"];
          saveUser(newValuse, usersUIProps.queryParams);
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
                <div className="form-group row" style={{ marginTop: 30 }}>
                  {/* First Name */}
                  <div className="col-lg-9 col-xl-6">
                    <Field
                      name="name"
                      component={Input}
                      mandatory={true}
                      placeholder="Name"
                      label="Name"
                    />
                  </div>
                </div>

                {values.id && (
                  <div className="form-group row">
                    <div className="col-lg-4">
                      <Field
                        name="isChangeEmail"
                        component={Switch}
                        label="Change Email: No/Yes"
                        checked={values.is_free}
                        onChange={(e) => {
                          const { checked } = e.target;
                          setIsChangeEmail(checked);
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group row">
                  <div className="col-lg-9 col-xl-6">
                    {/* spinner spinner-sm spinner-success spinner-right */}

                    <Field
                      disabled={values.id ? !isChangeEmail : false}
                      type="email"
                      name="email"
                      component={Input}
                      mandatory={true}
                      placeholder="Email"
                      label="Email"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-lg-9 col-xl-12">
                    <Field
                      type="email"
                      name="alternative_email"
                      component={Input}
                      placeholder="Alternative Email"
                      label="If your haven't an account in Zoom site with your main email, please write an alternative email that registered in Zoom."
                    />
                  </div>
                </div>

                <div className="form-group row">
                  {/* First Name */}
                  <div className="col-lg-9 col-xl-6">
                    <Field
                      type="password"
                      name="password"
                      component={Input}
                      mandatory={true}
                      placeholder="Password"
                      label="Password"
                    />
                  </div>
                </div>

                {/* <div className="form-group row">
                  <!--begin::Form Group-->
                  <div className="col-lg-9 col-xl-6">
                    <!--begin::Form Group-->
                    <div className="form-group row align-items-center">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Roles
                      </label>
                      <div className="col-lg-9 col-xl-6">
                        <div className="checkbox-inline">
                          <label className="checkbox">
                            <Field type="checkbox" name="roles" value="admin" />
                            <span></span>
                            Admin
                          </label>
                          <label className="checkbox">
                            <Field
                              type="checkbox"
                              name="roles"
                              value="teacher"
                            />
                            <span></span>
                            Teacher
                          </label>
                          <label className="checkbox">
                            <Field
                              type="checkbox"
                              name="roles"
                              value="free-user"
                            />
                            <span></span>
                            Free user
                          </label>
                          <label className="checkbox">
                            <Field
                              type="checkbox"
                              name="roles"
                              value="premium-user"
                            />
                            <span></span>
                            Premium user
                          </label>{" "}
                          <label className="checkbox">
                            <Field
                              type="checkbox"
                              name="roles"
                              value="ticket-agent"
                            />
                            <span></span>
                            Ticket agent
                          </label>
                        </div>
                      </div>
                    </div>
                    <!--begin::Form Group-->
                  </div>
                  <!--begin::Form Group-->
                </div> */}
                <div className="form-group row">
                  <div className="col-lg-4">
                    <Select
                      name="roles"
                      label="Role"
                      onChange={(e) => {
                        setFieldValue("roles", e.target.value);
                      }}
                      onBlur={handleBlur}
                      value={
                        values.id &&
                        baseRoles.find(
                          (r) => userRoles && userRoles.find((i) => r == i)
                        )
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="ticket-agent">Ticket agent</option>
                    </Select>
                  </div>
                </div>

                {/* <div className="form-group row"> */}
                {/* Gender */}
                {/* <div className="col-lg-9 col-xl-6">
                    <Select name="Gender" label="Gender">
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </Select>
                  </div> */}
                {/* Type */}
                {/* <div className="form-group row">
                  <div className="col-lg-9 col-xl-6">
                    <Select name="type" label="Type">
                      <option value="0">super-admin</option>
                      <option value="1">admin</option>
                    </Select>
                  </div>
                </div> */}
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
                              "users",
                              values.id
                            ).then((res) => {
                              dispatch(
                                actions.fetchUsers(usersUIProps.queryParams)
                              );
                            });
                          else
                            attachTagToElement(
                              value[value.length - 1].label,
                              "users",
                              values.id
                            ).then((res) => {
                              dispatch(
                                actions.fetchUsers(usersUIProps.queryParams)
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
              </Form>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: "space-between" }}>
              <div>
                {values.id && (
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(actions.activeAndDeactiveUser(values.id))
                    }
                    className={`btn btn-${
                      values.is_deactivated ? "success" : "danger"
                    } btn-elevate`}
                  >
                    {values.is_deactivated ? "Active Staff" : "Deactive Staff"}
                  </button>
                )}
              </div>
              <div>
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
              </div>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
