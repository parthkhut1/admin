// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";

import {
  Select,
  Textarea,
  Switch,
  Input,
} from "../../../../../../_metronic/_partials/controls";

import { useQuestionsUIContext } from "../QuestionsUIContext";

import * as requestFromServer from "./../_redux/questionsCrud";

export function QuestionAddToMockForm({
  saveQuestion,
  question,
  actionsLoading,
  onHide,
}) {
  const questionsUIContext = useQuestionsUIContext();
  const questionsUIProps = useMemo(() => {
    return {
      ids: questionsUIContext.ids,
      setIds: questionsUIContext.setIds,
      queryParams: questionsUIContext.queryParams,
    };
  }, [questionsUIContext]);

  const [mocks, setMocks] = useState([]);
  const [mock, setMock] = useState(0);

  useEffect(() => {
    // server call for getting mock tests list
    requestFromServer
      .getMockTestsList()
      .then((response) => {
        const {
          payload: {
            data: mockTests,
            meta: {
              pagination: { total: totalCount },
            },
          },
        } = response.data;

        setMocks(mockTests);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={question}
        onSubmit={(values) => {
          const newValue = {
            mock: parseInt(values.mock, 10),
          };
          saveQuestion(newValue, questionsUIProps.queryParams);
        }}
      >
        {({ handleSubmit, values, setFieldValue, handleBlur }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent" style={{zIndex:10}}>
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-12">
                    <Select
                      name="mock"
                      label="mock"
                      onChange={(e) => {
                        setMock(e.target.value);
                        setFieldValue("mock", e.target.value);
                      }}
                      onBlur={handleBlur}
                      value={values.mock}
                    >
                      {mocks.map((mk) => (
                        <option value={mk.id} key={mk.id}>
                          {mk.name}
                        </option>
                      ))}
                    </Select>
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
