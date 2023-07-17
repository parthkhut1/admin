import React, { useState } from "react";
import { useFormik } from "formik";

import { useSelector } from "react-redux";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { updatePassword } from "../_redux/authCrud";
import { useSnackbar } from "notistack";

const initialValues = {
  currentPassword: "",
  newPassword: "",
  verifyPassword: "",
};
const ChangePassword = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  const { intl } = props;
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const LoginSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .min(8, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    newPassword: Yup.string()
      .min(8, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    verifyPassword: Yup.string()
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      )
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      updatePassword(values.currentPassword, values.newPassword)
        .then((response) => {
          console.log("dssdsds", response);
          enqueueSnackbar("Password Changed Successfully!", { variant: "success" });
          disableLoading();
        })
        .catch(() => {
          enqueueSnackbar("Some error ocurred!", { variant: "error" });
          disableLoading();
          setSubmitting(false);
          setStatus(
            intl.formatMessage({
              id: "AUTH.VALIDATION.INVALID_LOGIN",
            })
          );
        });
    },
  });
  return (
    <>
      {/* <!--begin::Form--> */}
      <form className="form" onSubmit={formik.handleSubmit}>
        {/* <!--begin::Header--> */}
        <div className="card-header py-3">
          <div className="card-title align-items-start flex-column">
            <h3 className="card-label font-weight-bolder text-dark">
              Change Password
            </h3>
            <span className="text-muted font-weight-bold font-size-sm mt-1">
              Change your account password
            </span>
          </div>
          <div className="card-toolbar">
            <button type="submit" className="btn btn-success mr-2">
              Save Changes
            </button>
            <button type="reset" className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
        {/* <!--end::Header--> */}

        <div className="card-body">


          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Current Password
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                type="password"
                className={`form-control form-control-lg form-control-solid mb-2 ${getInputClasses(
                  "password"
                )}`}
                placeholder="Current password"
                name="currentPassword"
                {...formik.getFieldProps("currentPassword")}
              />
              <a href="#" className="text-sm font-weight-bold">
                Forgot password ?
              </a>
              {formik.touched.currentPassword &&
              formik.errors.currentPassword ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formik.errors.currentPassword}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              New Password
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                type="password"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "password"
                )}`}
                name="newPassword"
                placeholder="New password"
                {...formik.getFieldProps("newPassword")}
              />
              {formik.touched.newPassword && formik.errors.newPassword ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formik.errors.newPassword}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Verify Password
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                type="password"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "password"
                )}`}
                placeholder="Verify password"
                name="verifyPassword"
                {...formik.getFieldProps("verifyPassword")}
              />
              {formik.touched.verifyPassword && formik.errors.verifyPassword ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formik.errors.verifyPassword}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </form>
      {/* <!--end::Form--> */}
    </>
  );
};

export default injectIntl(connect(null, auth.actions)(ChangePassword));
