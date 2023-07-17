import React, { useState, useEffect } from "react";
// import { InputGroup , FormControl } from "react-bootstrap";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import EditIcon from "@material-ui/icons/Edit";

import { Checkbox, Radio, Input } from "@material-ui/core";

import { Select } from "../../../../_metronic/_partials/controls";
import { FieldFeedbackLabel } from "./FieldFeedbackLabel";

import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "100%",
  },
}));

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

const InputType = ({
  type,
  answer,
  onSelectAnswer,
  text,
  index,
  options,
  rFillBlanksOptions,
  ...props
}) => {
  switch (type) {
    case "checkbox":
      return (
        <Checkbox
          checked={answer?.findIndex((ans) => ans === text) !== -1}
          key={text}
          color="default"
          name="checkbox-button"
          onChange={() => onSelectAnswer(text)}
          value={answer}
        />
      );
    case "radio":
      return (
        <Radio
          checked={text === answer}
          key={text}
          color="default"
          name="radio-button"
          onChange={() => onSelectAnswer(text)}
          value={answer}
        />
      );
    case "input":
      return (
        <Input
          style={{ width: 40 }}
          inputProps={{ min: 1 }}
          key={text}
          color="default"
          type="number"
          name="text-input"
          onChange={(e) => onSelectAnswer(e.target.value, index)}
          value={answer[index]}
        />
      );
    case "select":
      return (
        <Select
          style={{ width: 60 }}
          key={text}
          name="select"
          onChange={(e) => onSelectAnswer(e.target.value, index)}
          value={answer[index]}
        >
          <option value=""></option>
          {options
            .map((opt, idx) => idx + 1)
            .map((opt) => (
              <option
                key={`select-${text}-${opt}`}
                value={opt}
                disabled={answer?.findIndex((a) => a == opt) !== -1}
              >
                {opt}
              </option>
            ))}
        </Select>
      );
    default:
      return null;
  }
};

export function AddOption({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  withFeedbackLabel = true,
  customFeedbackLabel,
  type = "text",
  inputType,
  onAddOption,
  onRemoveOption,
  onSelectAnswer,
  onUpdateAnswer,
  answer,
  options,
  rFillBlanksOptions = [],
  hasDeleteOption = true,
  hasMultiAnswers = false,
  isHideAddBtn = false,
  ...props
}) {
  const classes1 = useStyles();
  const [inputText, setInputText] = useState("");
  const [editBtnToggle, setEditBtnToggle] = useState(true);
  const [editable, setEditable] = useState([]);

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const onKeyPress = (e) => {
    if (e.keyCode == 13) {
      onAddOption(inputText);
      setInputText("");
    }
  };

  const setStyle = (text) => {
    let styles = {};
    if (inputType === "radio")
      return (styles = { backgroundColor: text === answer ? "#d3fff2" : "" });
    else if (inputType === "checkbox")
      return (styles = {
        backgroundColor:
          answer?.findIndex((ans) => ans === text) !== -1 ? "#d3fff2" : "",
      });
  };

  return (
    <>
      {options?.length != 0 &&
        options?.map((text, index) => (
          <FormControl
            key={text}
            className={clsx(classes1.margin, classes1.textField)}
            variant="outlined"
          >
            <InputLabel htmlFor={`item-${text}`}>
              {label} {index + 1}
            </InputLabel>

            <OutlinedInput
              type={type}
              value={editable[index]?.isEditable ? editable[index].value : text}
              style={setStyle(text)}
              disabled={!editable[index]?.isEditable}
              onChange={(e) => {
                const { value } = e.target;
                setEditable((prev) => {
                  const np = [...prev];
                  np[index].value = value;
                  return np;
                });
              }}
              endAdornment={
                <>
                  {/* {rFillBlanksOptions[index]?.disableEditBtn ? null : editable[
                      index
                    ]?.isEditable ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          // setEditBtnToggle(!editBtnToggle);
                          setEditable((prev) => {
                            const np = [...prev];
                            np[index] = {
                              ...np[index],
                              isEditable: false,
                            };
                            return np;
                          });
                          onUpdateAnswer(editable[index].value, index);
                        }}
                        edge="end"
                      >
                        <DoneOutlineIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          // setEditBtnToggle(!editBtnToggle);
                          setEditable((prev) => {
                            const np = [...prev];
                            if (np[index])
                              np[index] = {
                                ...np[index],
                                isEditable: true,
                              };
                            else np[index] = { isEditable: true, value: text };
                            return np;
                          });
                        }}
                        edge="end"
                      >
                        <EditIcon />
                      </IconButton>
                    </InputAdornment>
                  )} */}

                  {hasDeleteOption ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => onRemoveOption(text, index)}
                        edge="end"
                      >
                        {<RemoveCircleOutlineIcon />}
                      </IconButton>
                    </InputAdornment>
                  ) : null}
                </>
              }
              startAdornment={
                <InputAdornment position="start">
                  <InputType
                    type={inputType}
                    text={text}
                    answer={answer}
                    options={options}
                    onSelectAnswer={onSelectAnswer}
                    index={index}
                  />
                </InputAdornment>
              }
              labelWidth={90}
            />
          </FormControl>
        ))}

      {isHideAddBtn ? null : (
        <>
          <FormControl fullWidth className={classes1.margin} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-amount">{`${label} ${options?.length +
              1}`}</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              value={inputText}
              onChange={handleChange}
              onKeyDown={onKeyPress}
              startAdornment={
                <InputAdornment position="start">Write:</InputAdornment>
              }
              labelWidth={90}
            />
          </FormControl>

          <div className="form-group row">
            <div className="col-lg-2">
              <button
                onClick={() => {
                  onAddOption(inputText);
                  setInputText("");
                }}
                className="btn btn-success btn-elevate"
                type="button"
              >
                Add
              </button>
            </div>
          </div>
        </>
      )}
      {/* <input
        type={type}
        className={getFieldCSSClasses(touched[field.name], errors[field.name])}
        {...field}
        {...props}
      /> */}
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
