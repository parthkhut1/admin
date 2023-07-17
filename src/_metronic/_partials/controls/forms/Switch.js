import React from "react";
import { FieldFeedbackLabel } from "./FieldFeedbackLabel";

const getFieldCSSClasses = (touched, errors) => {
  const classes = ["form-control"];
  if (touched && errors) {
    classes.push("is-invalid");
  }

  if (touched && !errors) {
    classes.push("is-valid");
  }

  return classes.join(" ");
};

export function Switch({
  field, // { name, value, onChange, onBlur}
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  subLabel="",
  mandatory=true,
  withFeedbackLabel = true,
  customFeedbackLabel,
  type = "checkbox",
  ...props
}) {
  return (
    <>
      <div className="form-group row align-items-center">
      {label && <label className="col-xl-12 col-lg-6 col-form-label text-left"> {label} {mandatory && <span style={{color:"red"}}> *</span>} </label>}
      {subLabel && <label style={{fontSize: 10,color: "#303030"}} className="col-xl-12 col-lg-6 col-form-label text-left"> {subLabel}</label>}
        <div className="col-lg-4 col-xl-4">
          <span className="switch switch-sm">
            <label>
              <input
                className={getFieldCSSClasses(
                  touched[field.name],
                  errors[field.name]
                )}
                {...field}
                {...props}
                type={type}
              />
              <span></span>
            </label>
          </span>
        </div>
      </div>
      {withFeedbackLabel && (
        <FieldFeedbackLabel
          error={errors[field.name]}
          touched={touched[field.name]}
          label={label}
          customFeedbackLabel={customFeedbackLabel}
        />
      )}
    </>
  );
}
