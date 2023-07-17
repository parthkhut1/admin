import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";

import SnackbarUtils from "../../../notistack";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function GenerateRandomPackage({
  limitations,
  onChange,
  onAddNewItem,
  onEditItem,
}) {
  const [item, setItem] = useState({});
  const classes = useStyles();

  return (
    <div>
      {limitations.map((q, i) => (
        <div
          key={i}
          style={{
            border: "1px solid rgb(230 230 230)",
            borderRadius: "3px",
            marginBottom: 20,
          }}
        >
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="grouped-native-select">Options</InputLabel>
            <Select
              native
              disabled={q.isDisabled}
              name="type"
              value={q.type}
              onChange={(e) => {
                const { value } = e.target;
                const existType = limitations.find((i) => i.type === value);
                if (existType)
                  return SnackbarUtils.error("Item already exist.");
                else onChange({ ...q, type: value });
              }}
            >
              <optgroup label="Options">
                <option value="questions">Questions</option>
                <option value="sessions">Sessions</option>
                <option value="mocks">Mock-tests</option>
                <option value="courses">Courses</option>
              </optgroup>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              label="Limit"
              type="number"
              name="limit"
              disabled={q.isDisabled}
              InputProps={{ inputProps: { min: 0 } }}
              value={q.limit}
              onChange={(e) => {
                const { value } = e.target;
                onChange({ ...q, limit: value });
              }}
            />
          </FormControl>
          <button
            className="btn btn-success btn-elevate"
            onClick={() => onEditItem(q)}
            type="button"
            style={{ marginTop: 10 }}
          >
            {q.isDisabled ? "Edit" : "Save"}
          </button>
        </div>
      ))}

      <div
        style={{ border: "1px solid rgb(230 230 230)", borderRadius: "3px" }}
      >
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="grouped-native-select">Options</InputLabel>
          <Select
            native
            name="type"
            defaultValue=""
            value={item?.type || ""}
            onChange={(e) => {
              const { value } = e.target;
              setItem((prev) => ({ ...prev, type: value }));
            }}
          >
            <option aria-label="None" value="" />
            <optgroup label="Options">
              <option value="questions">Questions</option>
              <option value="sessions">Sessions</option>
              <option value="mocks">Mock-tests</option>
            </optgroup>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            label="Limit"
            type="number"
            name="limit"
            value={item?.limit}
            InputProps={{ inputProps: { min: 0 } }}
            onChange={(e) => {
              const { value } = e.target;
              setItem((prev) => ({ ...prev, limit: value }));
            }}
          />
        </FormControl>
      </div>
      <div className="form-group row" style={{ marginTop: "20px" }}>
        <div className="col-lg-2">
          <button
            onClick={() => {
              if (!item.type) {
                return SnackbarUtils.error("Select Item type");
              } else {
                const existItem = limitations.find(
                  (rq) => rq.type === item.type
                );
                if (!existItem) {
                  onAddNewItem({ ...item, id: Date.now(), isDisabled: true });
                } else {
                  return SnackbarUtils.error("Item already exist.");
                }
                setItem({ type: "", limit: 0 });
              }
            }}
            className="btn btn-success btn-elevate"
            type="button"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
