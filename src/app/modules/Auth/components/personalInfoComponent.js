import React, { useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { update } from "../_redux/authCrud";
import * as auth from "../_redux/authRedux";
import { useSnackbar } from "notistack";



const initialValues = {
  name: "",
  email: "",
};

const PersonalInfo = (props) => {
  const { intl } = props;
  const { user } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();


  initialValues.name = user.name;
  initialValues.email = user.email;

  const [loading, setLoading] = useState(false);
  const PersonalInfoSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),

    name: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("required",
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
    validationSchema: PersonalInfoSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
        update(values.name)
          .then((response) => {
            enqueueSnackbar("Info Changed Successfully!", { variant: "success" });
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
              Personal Information
            </h3>
            <span className="text-muted font-weight-bold font-size-sm mt-1">
              Update your personal informaiton
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

        {/* <!--begin::Body--> */}
        <div className="card-body">
          <div className="row">
            <label className="col-xl-3"></label>
            <div className="col-lg-9 col-xl-6">
              <h5 className="font-weight-bold mb-6">Personal Info</h5>
            </div>
          </div>

          <div className="form-group fv-plugins-icon-container">
            <label className="col-xl-3 col-lg-3 col-form-label">Name</label>
            <input
              placeholder="Name"
              type="text"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "name"
              )}`}
              name="name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.password}</div>
              </div>
            ) : null}
          </div>

          <div className="form-group fv-plugins-icon-container">
            <label className="col-xl-3 col-lg-3 col-form-label">
              Email Address
            </label>
            <input
              style={{color:"gray"}}
              disabled
              placeholder="Email"
              type="email"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "email"
              )}`}
              name="email"
              {...formik.getFieldProps("email")}
            />
            <span className="form-text text-muted">
              Email cannot be changed.{" "}
            </span>
            {formik.touched.email && formik.errors.email ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.email}</div>
              </div>
            ) : null}
          </div>
        </div>
        {/* <!--end::Body--> */}
      </form>
      {/* <!--end::Form--> */}
    </>
  );
};

export default injectIntl(connect(null, auth.actions)(PersonalInfo));
