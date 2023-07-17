// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { format, parseISO } from "date-fns";
import { Input } from "../../../../_metronic/_partials/controls";
import moment from "moment";

import { usePaymentsUIContext } from "../PaymentLogsUIContext";

// Validation schema
const PaymentEditSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Name is required"),
  // lastName: Yup.string()
  //   .min(3, "Minimum 3 symbols")
  //   .max(50, "Maximum 50 symbols")
  //   .required("Lastname is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),

  roles: Yup.string().required("Password is required"),
  // userName: Yup.string().required("Username is required"),
  // dateOfBbirth: Yup.mixed()
  //   .nullable(false)
  //   .required("Date of Birth is required"),
  // ipAddress: Yup.string().required("IP Address is required"),
});

export function PaymentEditForm({
  savePayment,
  payment,
  actionsLoading,
  onHide,
}) {
  const PaymentsUIContext = usePaymentsUIContext();
  const PaymentsUIProps = useMemo(() => {
    return {
      ids: PaymentsUIContext.ids,
      setIds: PaymentsUIContext.setIds,
      queryParams: PaymentsUIContext.queryParams,
    };
  }, [PaymentsUIContext]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={payment}
        validationSchema={PaymentEditSchema}
        onSubmit={(values) => {
          savePayment(values, PaymentsUIProps.queryParams);
        }}
      >
        {({ handleSubmit, values }) => (
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
                  <div className="col-lg-6">
                    <Field
                      name="id"
                      component={Input}
                      hideEnterTitle={true}
                      disabled
                      placeholder="Payment Id"
                      label="Payment Id"
                    />
                  </div>
                  <div className="col-lg-6">
                    <Field
                      name="payable_id"
                      component={Input}
                      hideEnterTitle={true}
                      disabled
                      placeholder="Payable Id"
                      label="Payable Id"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-6">
                    <Field
                      name="coupon_id"
                      component={Input}
                      hideEnterTitle={true}
                      disabled
                      placeholder="Coupon Id"
                      label="Coupon Id"
                      defaultValue={0}
                    />
                  </div>
                  <div className="col-lg-6">
                    <Field
                      type="text"
                      name="gateway"
                      component={Input}
                      hideEnterTitle={true}
                      disabled
                      placeholder="Gateway"
                      label="Gateway"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-6">
                    <Field
                      type="text"
                      name="price"
                      component={Input}
                      hideEnterTitle={true}
                      disabled
                      placeholder="Original price"
                      label="Original price"
                    />
                  </div>
                  <div className="col-lg-6">
                    <Field
                      name="discounted_price"
                      component={Input}
                      hideEnterTitle={true}
                      disabled
                      placeholder="Payable price"
                      label="Payable price"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-6">
                    <Field
                      name="status"
                      component={Input}
                      hideEnterTitle={true}
                      disabled
                      placeholder="Status"
                      label="Status"
                    />
                  </div>

                  <div className="col-lg-6">
                    <Field
                      type="text"
                      name="created_at"
                      component={Input}
                      hideEnterTitle={true}
                      value={moment(
                        values.created_at,
                        "YYYY-MM-DD HH:mm"
                      ).format("YYYY-MM-DD HH:mm")}
                      disabled
                      placeholder="Created at"
                      label="Created at"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-6">
                    <Field
                      type="text"
                      name="user.id"
                      component={Input}
                      hideEnterTitle={true}
                      value={values.user?.id}
                      disabled
                      placeholder="User id"
                      label="User id"
                    />
                  </div>

                  <div className="col-lg-6">
                    <Field
                      type="text"
                      name="user.name"
                      component={Input}
                      hideEnterTitle={true}
                      value={values.user?.name}
                      disabled
                      placeholder="User name"
                      label="User name"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-6">
                    <Field
                      type="text"
                      name="user_email"
                      component={Input}
                      hideEnterTitle={true}
                      value={values.user_email}
                      disabled
                      placeholder="User email"
                      label="User email"
                    />
                  </div>

                  <div className="col-lg-6">
                    <Field
                      type="text"
                      name="package_name"
                      component={Input}
                      hideEnterTitle={true}
                      value={values.package_name}
                      disabled
                      placeholder="Package name"
                      label="Package name"
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
              >
                Close
              </button>
              <> </>
              {/* <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary btn-elevate"
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
