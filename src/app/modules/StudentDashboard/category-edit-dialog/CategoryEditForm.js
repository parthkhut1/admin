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
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/categoriesActions";
import {
  Input,
  DatePickerField,
  Switch,
  Select,
} from "../../../../_metronic/_partials/controls";
import { useCategoriesUIContext } from "../CategoriesUIContext";

import DashboardNotification from "../components/DashboardNotification";
import DashboardBanner from "../components/DashboardBanner";
import DashboardVideos from "../components/DashboardVideos";

// Validation schema
const CategoryEditSchema = Yup.object().shape({});

export function CategoryEditForm({
  saveCategory,
  category,
  actionsLoading,
  onHide,
}) {
  const dispatch = useDispatch();
  const [isDelete, setIsDelete] = useState(false);

  const { level0 } = useSelector(
    (state) => ({
      level0: state.categories.level0,
    }),
    shallowEqual
  );
  const categoriesUIContext = useCategoriesUIContext();

  const categoriesUIProps = useMemo(() => {
    return {
      ids: categoriesUIContext.ids,
      setIds: categoriesUIContext.setIds,
      queryParams: categoriesUIContext.queryParams,
    };
  }, [categoriesUIContext]);

  useEffect(() => {}, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={category}
        validationSchema={CategoryEditSchema}
        onSubmit={(values) => {
          const newValues = {
            ...values,
          };

          saveCategory(newValues, categoriesUIProps.queryParams);
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
                  defaultActiveKey="dashboard-notification"
                  onSelect={(e) => {}}
                >
                  <Tab
                    eventKey="dashboard-notification"
                    title="Dashboard Notification"
                  >
                    <DashboardNotification />
                  </Tab>
                  <Tab eventKey="dashboard-banner" title="Dashboard Banner">
                    <DashboardBanner />
                  </Tab>
                  <Tab eventKey="dashboard-videos" title="Dashboard Videos">
                    <DashboardVideos />
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
              {/* <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary btn-elevate"
                disabled={actionsLoading}
              >
                Save
              </button> */}
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
