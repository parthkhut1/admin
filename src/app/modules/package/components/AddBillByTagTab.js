import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import SnackbarUtils from "../../../notistack";
import { Formik, Form, Field } from "formik";
import AsyncSelect from "react-select/async";
import {
  attachTagToElement,
  detachTagToElement,
  findTags,
} from "../../../tagService";
import { difference } from "lodash";

import {
  Input,
  Select,
  Switch,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";
import CoursesTable from "./CoursesTable";
import * as actions from "../_redux/packagesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

export default function AddBillByTagTab({ scopeId, comingTags, sendTags }) {
  const { enqueueSnackbar } = useSnackbar();
  const [tags, setTags] = useState([]);

  // packages Redux state
  const dispatch = useDispatch();
  const { listLoading, filteredCourses } = useSelector(
    (state) => ({
      listLoading: state.scopes.listLoading,
      filteredCourses: state.scopes.filteredCourses,
    }),
    shallowEqual
  );

  useEffect(() => {
    const newData = comingTags?.map((i) => ({
      value: i,
      label: i,
    }));
    setTags(newData);
  }, [comingTags]);

  const filterTags = async (inputValue) => {
    const {
      data: {
        payload: { data },
      },
    } = await findTags(inputValue);
    const newData = data.map((i) => ({
      id: i.id,
      value: i.name,
      label: i.name,
    }));
    return newData;
  };

  const promiseTagsOptions = (inputValue) =>
    new Promise((resolve) => {
      resolve(filterTags(inputValue));
    });
  return (
    <>
      <div className="form-group row" style={{ marginTop: 40 }}>
        <div className="col-lg-12">
          <label>Added Tags</label>
          <br />
          <AsyncSelect
            isMulti
            name="tags"
            isClearable={false}
            cacheOptions
            defaultOptions
            loadOptions={promiseTagsOptions}
            getOptionLabel={(option) => `${option?.label ? option?.label : ""}`}
            getOptionValue={(option) => option.value}
            value={tags}
            onChange={(value) => {
              const deletedTag = difference(tags, value);
              setTags(value);
              if (scopeId) {
                if (deletedTag.length != 0) {
                  dispatch(
                    actions.removeTagFromScope(scopeId, [
                      deletedTag.pop().label,
                    ])
                  );
                } else {
                  dispatch(
                    actions.addTagToScope(scopeId, [
                      value[value.length - 1].label,
                    ])
                  );
                }
              }else sendTags(value.map(i=>i.label))
            }}
            // onBlur={() => setFieldTouched("tags", true)}
          />
        </div>
      </div>
    </>
  );
}
