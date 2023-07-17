import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import SnackbarUtils from "../../../notistack";
import { Formik, Form, Field } from "formik";
import SelectInput from "react-select";
import { difference } from "lodash";
import { mergeFunctionWithId } from "../../../utility";

import {
  Input,
  Select,
  Switch,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";
import CoursesTable from "./CoursesTable";
import * as actions from "../_redux/couponsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

export default function AddCoursesTab({ scopeId, comingCourses, sendCourses }) {
  const [values, setValues] = useState({});
  const [publishedAt, setPublishedAt] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [isFree, setIsFree] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const [courses, setCourses] = useState([]);

  // packages Redux state
  const dispatch = useDispatch();
  const { listLoading, filteredCourses } = useSelector(
    (state) => ({
      listLoading: state.coupons.listLoading,
      filteredCourses: state.coupons.filteredCourses,
    }),
    shallowEqual
  );
  useEffect(() => {
    const addTags = comingCourses?.map((i) => ({
      id: i.id,
      billable_id: i.billable_id,
      value: i.title,
      label: i.title,
    }));
    setCourses(addTags);
  }, [comingCourses]);
  return (
    <>
      <div className="form-group row" style={{ marginTop: 40 }}>
        <div className="col-lg-12">
          <label>Added Course</label>
          <br />
          <SelectInput
            value={courses}
            isMulti
            name="colors"
            isSearchable={false}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(remainItems) => {
              const removingTags = difference(courses, remainItems);
              dispatch(
                actions.removeBillFromScope(scopeId, [
                  removingTags[0].billable_id,
                ])
              );

              setCourses(remainItems);
            }}
            noOptionsMessage={(str) => "To add items, please filter below."}
            placeholder="No items."
          />
        </div>
      </div>
      <div className="form-group row" style={{ marginTop: 30 }}>
        <div className="col-lg-12">
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
      </div>
      <div className="form-group row">
        <div className="col-lg-4">
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
        <div className="col-lg-4">
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
          const addTags = courses.map((i) => ({
            id: i.id,
            billable_id: i.billable_id,
            value: i.title,
            label: i.title,
          }));
          setCourses((prev) => {
            if (prev) return mergeFunctionWithId([...prev, ...addTags]);
            else return [...addTags];
          });
          if (scopeId) {
            dispatch(
              actions.addBillToScope(
                scopeId,
                courses?.map((i) => i.billable_id)
              )
            );
            SnackbarUtils.success("Courses added Successfully!");
          } else sendCourses(courses?.map((i) => i.billable_id));
        }}
        filterValues={values}
      />
    </>
  );
}
