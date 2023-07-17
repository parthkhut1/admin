import React from "react";
import { FieldFeedbackLabel } from "./FieldFeedbackLabel";

const getFieldCSSClasses = (touched, errors) => {
  const classes = ["form-control"];
  if (touched && errors) {
    // classes.push("is-invalid");
  }

  if (touched && !errors) {
    // classes.push("is-valid");
  }

  return classes.join(" ");
};

export function Textarea({
  field, // { name, value, onChange, onBlur, rows, cols}
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  mandatory,
  withFeedbackLabel = true,
  customFeedbackLabel,
  ...props
}) {
  return (
    <>
      {label && <label>Enter {label} {mandatory && <span style={{color:"red"}}> *</span>}</label>}
      <textarea
        className={getFieldCSSClasses(touched[field.name], errors[field.name])}
        {...field}
        {...props}
      ></textarea>
      {/* {withFeedbackLabel && (
        <FieldFeedbackLabel
          error={errors[field.name]}
          touched={touched[field.name]}
          label={label}
          customFeedbackLabel={customFeedbackLabel}
        />
      )} */}
    </>
  );
}
