// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo , useEffect} from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { format, parseISO } from "date-fns";
import {
  Input,
  DatePickerField,
  Switch,
} from "../../../../_metronic/_partials/controls";
import AsyncSelect from "react-select/async";
import { findTeacher } from "../_redux/tagsCrud";
import { useTagsUIContext } from "../TagsUIContext";

// Validation schema
const TagEditSchema = Yup.object().shape({});

export function TagEditForm({
  saveTag,
  tag,
  actionsLoading,
  onHide,
}) {
  const tagsUIContext = useTagsUIContext();
  const tagsUIProps = useMemo(() => {
    return {
      ids: tagsUIContext.ids,
      setIds: tagsUIContext.setIds,
      queryParams: tagsUIContext.queryParams,
    };
  }, [tagsUIContext]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={tag}
        validationSchema={TagEditSchema}
        onSubmit={(values) => {

          saveTag(values, tagsUIProps.queryParams);
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
                <div className="form-group row">
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
