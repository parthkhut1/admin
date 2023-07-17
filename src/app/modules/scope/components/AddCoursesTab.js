import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import SnackbarUtils from "../../../notistack";
import { Formik, Form, Field } from "formik";

import {
  Input,
  Select,
  Switch,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";
import * as requestFromServer from "../_redux/scopesCrud";
import CoursesTable from "./CoursesTable";
import * as actions from "../_redux/scopesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

export default function AddCoursesTab({ sendCourses }) {
  const [values, setValues] = useState({});
  const [publishedAt, setPublishedAt] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [isFree, setIsFree] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  // packages Redux state
  const dispatch = useDispatch();
  const { listLoading, filteredCourses } = useSelector(
    (state) => ({
      listLoading: state.scopes.listLoading,
      filteredCourses: state.scopes.filteredCourses,
    }),
    shallowEqual
  );
  return (
    <>
      <div className="form-group row" style={{ marginTop: 30 }}>
        <div className="col-lg-4">
          <label>Search Course Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Course Title"
            onChange={(e) => {
              const { value } = e.target;
              setCourseTitle(value);
            }}
          />
        </div>
        <div className="col-lg-4" style={{ marginTop: "30px" }}>
          <DatePickerField
            name="publishedAt"
            label="Published at"
            captionHide={true}
            dateFormat="yyyy-MM-dd"
            sendDate={(date) => {
              setPublishedAt(format(date, "yyyy-MM-dd"));
            }}
          />
        </div>
        <div className="col-lg-4" style={{ marginTop: "30px" }}>
          <Select
            label="Paid or Free"
            value={isFree}
            mandatory={false}
            onChange={(e) => {
              const { value } = e.target;
              setIsFree(value);
            }}
          >
            <option value=""></option>
            <option value="1">Free</option>
            <option value="0">Paid</option>
          </Select>
        </div>
      </div>

      <div className="form-group row">
        <div className="col-lg-6">
          <button
            onClick={() => {
              const values = {
                title: courseTitle,
                published_at: publishedAt,
                is_free: isFree,
                per_page: 10,
                page: 1,
              };

              setValues(values);
              dispatch(actions.fetchFilteredCourses(values));
            }}
            className="btn btn-primary btn-elevate"
            type="button"
          >
            {listLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{ marginRight: "10px", padding: "5px" }}
              />
            ) : null}
            Apply filters
          </button>
        </div>
      </div>
      <CoursesTable
        filterdCourses={filteredCourses}
        onAdd={(courses) => {
          sendCourses(courses);
          SnackbarUtils.success("Courses added Successfully!");
        }}
        filterValues={values}
      />
    </>
  );
}
