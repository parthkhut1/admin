// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as requestFromServer from "./../_redux/ticketsCrud";
import * as actions from "../_redux/ticketsActions";
import { uniq, uniqBy } from "lodash";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import * as Yup from "yup";
import { format, parseISO } from "date-fns";
import {
  Input,
  DatePickerField,
  Switch,
  Select,
  Textarea,
} from "../../../../_metronic/_partials/controls";
import { findTeacher } from "../_redux/ticketsCrud";
import { useTicketsUIContext } from "../TicketsUIContext";
import MessageBox from "../components/messageBox";
import AsyncSelect from "react-select/async";

import { difference, reverse } from "lodash";

// Validation schema
const TicketEditSchema = Yup.object().shape({});

export function TicketEditForm({ saveTicket, ticket, actionsLoading, onHide }) {
  const ticketsUIContext = useTicketsUIContext();
  const [selectedTab, setSelectedTab] = useState("");

  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);

  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  // tickets Redux state
  const dispatch = useDispatch();
  const { messages, user } = useSelector(
    (state) => ({
      messages: state.tickets.messages,
    }),
    shallowEqual
  );

  const ticketsUIProps = useMemo(() => {
    return {
      ids: ticketsUIContext.ids,
      setIds: ticketsUIContext.setIds,
      queryParams: ticketsUIContext.queryParams,
    };
  }, [ticketsUIContext]);

  const filterTeachers = async (inputValue) => {
    const {
      data: {
        payload: { data },
      },
    } = await findTeacher(inputValue);
    return data;
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      resolve(filterTeachers(inputValue));
    });

  useEffect(() => {
    requestFromServer
      .findCategories()
      .then((response) => {
        const { payload } = response.data;
        setCategories(Object.values(payload));
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  useEffect(() => {
    requestFromServer
      .findPriorities()
      .then((response) => {
        const { payload } = response.data;
        setPriorities(Object.values(payload));
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  useEffect(() => {

    // if (ticket.id) dispatch(actions.fetchMessages(ticket.id));

    const a = [{id:1,name:"s1"},{id:2,name:"s2"},{id:1,name:"s1"}]
    console.log("a$$$$$$$$$$$",uniqBy(a,'id'));

  }, [ticket.id]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={ticket}
        validationSchema={TicketEditSchema}
        onSubmit={(values) => {
          const newValues = {
            ...values,
            message: {
              text: "Hi, How we can help you?",
            },
            user_id: values?.user?.id,
          };
          if (newValues.category === "Tests") newValues["category_id"] = 1;
          else if (newValues.category === "Mock Tests")
            newValues["category_id"] = 2;
          else if (newValues.category === "Packages")
            newValues["category_id"] = 3;

          if (newValues.priority === "High") newValues["priority_id"] = 1;
          else if (newValues.priority === "Normal")
            newValues["priority_id"] = 2;
          else if (newValues.priority === "Low") newValues["priority_id"] = 3;

          // console.log("newValues", newValues);
          saveTicket(newValues, ticketsUIProps.queryParams);
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
                  defaultActiveKey="ticket"
                  onSelect={(e) => {
                    setSelectedTab(e);
                  }}
                >
                  <Tab eventKey="ticket" title="Ticket">
                    <div className="form-group row" style={{ marginTop: 30 }}>
                      <div className="col-lg-12">
                        <Field
                          type="text"
                          name="caption"
                          mandatory={true}
                          component={Input}
                          disableValidation={true}
                          placeholder="Caption"
                          label="Caption"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-6" style={{ marginTop: "20px" }}>
                        <Select
                          label="Categories"
                          mandatory={false}
                          value={values.category}
                          onChange={(e) => {
                            const { value } = e.target;
                            setFieldValue("category", value);
                          }}
                        >
                          <option value=""></option>
                          {categories?.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="col-lg-6" style={{ marginTop: "20px" }}>
                        <Select
                          label="Priorities"
                          mandatory={false}
                          value={values.priority}
                          onChange={(e) => {
                            const { value } = e.target;
                            setFieldValue("priority", value);
                          }}
                        >
                          <option value=""></option>
                          {priorities?.map((priority) => (
                            <option key={priority} value={priority}>
                              {priority}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-8">
                        <label>
                          User<span style={{ color: "red" }}> *</span>
                        </label>
                        <br />
                        <AsyncSelect
                          // isMulti
                          name="teacher"
                          cacheOptions
                          defaultOptions
                          isDisabled={values.id}
                          loadOptions={promiseOptions}
                          getOptionLabel={(option) =>
                            `${option?.name ? option?.name : ""}  ${
                              option?.email ? `(${option?.email})` : ""
                            }`
                          }
                          getOptionValue={(option) => option.id}
                          value={values.user}
                          onChange={(value) => {
                            setFieldValue("user", value);
                          }}
                          onBlur={() => setFieldTouched("user", true)}
                        />
                      </div>
                    </div>
                    {values.id && (
                      <div className="form-group row">
                        <div className="col-lg-8">
                          <Field
                            name="opened"
                            component={Switch}
                            mandatory={false}
                            label="Open/Close"
                            checked={values.opened}
                            onChange={(e) => {
                              const { checked } = e.target;
                              setFieldValue("opened", checked);
                              dispatch(
                                actions.changeTicketState(values.id, checked)
                              );
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </Tab>
                  <Tab eventKey="chat" title="Chat" disabled={!values.id}>
                    <MessageBox messages={messages} ticket={values} />
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
