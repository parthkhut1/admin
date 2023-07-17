import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import SnackbarUtils from "../../../notistack";
import { Formik, Form, Field } from "formik";
import SelectInput from "react-select";
import { difference } from "lodash";
import { mergeFunctionWithId } from "../../../utility";
import Alert from "@material-ui/lab/Alert";

import {
  Input,
  Select,
  Switch,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";
import CoursesTable from "./CoursesTable";
import * as actions from "../_redux/packagesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

export default function AddCoursesTab({
  scopeId,
  comingCourses,
  sendCourses,
  packageId,
  sendCourseLimitation,
  comingPackage,
}) {
  const [values, setValues] = useState({});
  const [publishedAt, setPublishedAt] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [isFree, setIsFree] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const [courses, setCourses] = useState([]);

  const [limit, setLimit] = useState(0);

  // packages Redux state
  const dispatch = useDispatch();
  const { listLoading, filteredCourses } = useSelector(
    (state) => ({
      listLoading: state.packages.listLoading,
      filteredCourses: state.packages.filteredCourses,
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
  useEffect(() => {
    sendCourseLimitation(limit);
  }, [limit]);

  useEffect(() => {
    setLimit(
      comingPackage?.scopes?.find((i) => i?.scope?.billable_type == "courses")
        ?.limit
    );
  }, [comingPackage]);

  return (
    <>
      {/* <br />

      <Alert severity="warning">
        Attention! Please consider that you are able to set "Usage Limitation"
        only during the package creation and it could not be changed in the
        updating process.
      </Alert>

      <br />
      <div className="form-group row" style={{ marginTop: 10 }}>
        <div className="col-lg-4">
          <Field
            type="number"
            name="limit"
            disableValidation={true}
            min="0"
            component={Input}
            disabled={packageId}
            placeholder="Usage Limitation"
            label="Usage Limitation"
            onChange={(e) => {
              const { value } = e.target;
              setLimit(value);
            }}
            value={limit}
          />
        </div>
      </div> */}
      <div className="form-group row" style={{marginTop:30}}>
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
      <div className="form-group row" style={{ marginTop: "30px" }}>
        <div className="col-lg-4" style={{ marginTop: "30px" }}>
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
          } else {
            sendCourses(courses?.map((i) => i.billable_id));
          }
        }}
        filterValues={values}
      />
    </>
  );
}
