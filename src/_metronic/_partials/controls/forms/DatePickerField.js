import React from "react";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

const getFieldCSSClasses = (touched, errors) => {
  const classes = ["form-control"];
  if (touched && errors) {
    classes.push("is-invalid");
  }

  if (touched && !errors) {
    // classes.push("is-valid");
  }

  return classes.join(" ");
};

export function DatePickerField({
  mandatory = false,
  captionHide = false,
  dateFormat = "yyyy-MM-dd HH:mm:ss",
  sendDate,
  ...props
}) {
  const { setFieldValue, errors, touched } = useFormikContext();
  const [field] = useField(props);
  return (
    <>
      {props.label && (
        <label>
          {props.label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </label>
      )}
      <br />
      <DatePicker
        className={getFieldCSSClasses(touched[field.name], errors[field.name])}
        style={{ width: "100%" }}
        {...field}
        {...props}
        dateFormat={dateFormat}
        selected={(field.value && new Date(field.value)) || null}
        
        onChange={(val) => {
          setFieldValue(field.name, format(val, dateFormat));
          sendDate(val);
        }}
      />
      {errors[field.name] && touched[field.name] ? (
        <div className="invalid-datepicker-feedback">
          {errors[field.name].toString()}
        </div>
      ) : (
        !captionHide && (
          <div className="feedback">
            Please enter <b>{props.label}</b> in 'mm/dd/yyyy' format
          </div>
        )
      )}
    </>
  );
}
