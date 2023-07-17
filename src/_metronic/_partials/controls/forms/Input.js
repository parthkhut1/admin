import React from "react";
import { FieldFeedbackLabel } from "./FieldFeedbackLabel";

const getFieldCSSClasses = (touched, errors, disableValidation) => {
  const classes = ["form-control"];
  if (!disableValidation) {
    if (touched && errors) {
      classes.push("is-invalid");
    }

    if (touched && !errors) {
      classes.push("is-valid");
    }
  }

  return classes.join(" ");
};

export function Input({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  withFeedbackLabel = false,
  customFeedbackLabel,
  type = "text",
  mandatory = false,
  disableValidation = false,
  hideEnterTitle=false,
  ...props
}) {
  return (
    <>
      {label && <label>{hideEnterTitle?"":"Enter"} {label} {mandatory && <span style={{ color: "red" }}> *</span>} </label>}
      <input
        type={type}
        className={getFieldCSSClasses(
          touched[field.name],
          errors[field.name],
          disableValidation
        )}
        {...field}
        {...props}
      />

      {withFeedbackLabel && (
        <FieldFeedbackLabel
          error={errors[field.name]}
          touched={touched[field.name]}
          label={label}
          type={type}
          customFeedbackLabel={customFeedbackLabel}
        />
      )}
    </>
  );
}
