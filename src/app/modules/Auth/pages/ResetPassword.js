import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { reset } from "../_redux/authCrud";
import querystring from "query-string";
import { useSnackbar } from "notistack";

/*
  INTL (i18n) docs:
  https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage
*/

/*
  Formik+YUP:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
*/

const initialValues = {
  password: "",
};

function ResetPassword(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [isRequested, setIsRequested] = useState(false);

  const { intl, history } = props;
  const {
    location: { search },
  } = history;

  const queryParams = querystring.parse(search);
  const [loading, setLoading] = useState(false);
  const LoginSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Minimum 8 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
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
      reset(queryParams.email, queryParams.token, values.password)
        .then(
          ({
            data: {
              payload: { data: user },
            },
          }) => {
            enqueueSnackbar("Your password changed successfully!", {
              variant: "success",
            });
            setIsRequested(true);
            disableLoading();
          }
        )
        .catch(() => {
          enqueueSnackbar("Some error ocurred.", { variant: "error" });

          disableLoading();
          setIsRequested(false);
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
      {isRequested && <Redirect to="/auth" />}
      {!isRequested && (
        <div className="login-form login-signin" id="kt_login_signin_form">
          {/* begin::Head */}
          <div className="text-center mb-10 mb-lg-20">
            <h3 className="font-size-h1">
              <FormattedMessage id="AUTH.RESET.TITLE" />
            </h3>
            <p className="text-muted font-weight-bold">
              Enter your token and new password
            </p>
          </div>
          {/* end::Head */}

          {/*begin::Form*/}
          <form
            onSubmit={formik.handleSubmit}
            className="form fv-plugins-bootstrap fv-plugins-framework"
          >
            {/* <div className="form-group fv-plugins-icon-container">
              <input
                placeholder="Token"
                type="text"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "token"
                )}`}
                name="token"
                {...formik.getFieldProps("token")}
              />
    
              console.log("formik.touched.email",formik.touched.email)
              {formik.touched.email && formik.errors.email ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.email}</div>
                </div>
              ) : null}
            </div> */}
            <div className="form-group fv-plugins-icon-container">
              <input
                placeholder="Password"
                type="password"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "password"
                )}`}
                name="password"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.password}</div>
                </div>
              ) : null}
            </div>
            <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
              <button
                id="kt_login_signin_submit"
                type="submit"
                disabled={formik.isSubmitting}
                className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
              >
                <span>Reset</span>
                {loading && (
                  <span className="ml-3 spinner spinner-white"></span>
                )}
              </button>
            </div>
          </form>
          {/*end::Form*/}
        </div>
      )}
    </>
  );
}

export default injectIntl(connect(null, auth.actions)(ResetPassword));
