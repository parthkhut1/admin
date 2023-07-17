import React, { useMemo, useEffect, useState } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useCoursesUIContext } from "../CoursesUIContext";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/coursesActions";

const prepareFilter = (queryParams, values) => {
  const { status, type, tag, searchText, categoryId } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  if (searchText) filter.email = searchText;
  if (tag) filter.tag = tag;
  if (categoryId) filter.categoryId = categoryId;

  newQueryParams.filter = filter;
  return newQueryParams;
};

export function CoursesFilter({ listLoading }) {
  // courses UI Context
  const coursesUIContext = useCoursesUIContext();
  const dispatch = useDispatch();

  const [mainCategoryId, setMainCategoryId] = useState();
  const [subCategoryId, setSubCategoryId] = useState();

  const coursesUIProps = useMemo(() => {
    return {
      queryParams: coursesUIContext.queryParams,
      setQueryParams: coursesUIContext.setQueryParams,
    };
  }, [coursesUIContext]);

  const { mainCatagories, subCatagories, subCatagorieslevel3 } = useSelector(
    (state) => ({
      mainCatagories: state.courses.mainCatagories,
      subCatagories: state.courses.subCatagories,
      subCatagorieslevel3: state.courses.subCatagorieslevel3,
    }),
    shallowEqual
  );

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(coursesUIProps.queryParams, values);
    if (!isEqual(newQueryParams, coursesUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      coursesUIProps.setQueryParams(newQueryParams);
    }
  };
  useEffect(() => {
    dispatch(actions.fetchTreeChild(0));
  }, []);

  useEffect(() => {
    if (mainCategoryId) dispatch(actions.fetchTreeChild(mainCategoryId));
  }, [mainCategoryId]);

  useEffect(() => {
    if (subCategoryId) dispatch(actions.fetchTreeChildLevel2(subCategoryId));
  }, [subCategoryId]);

  return (
    <>
      <Formik
        initialValues={{
          status: "", // values => All=""/Susspended=0/Active=1/Pending=2
          type: "", // values => All=""/Business=0/Individual=1
          searchText: "",
          tag: "",
          categoryId: "",
        }}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          handleChange,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="form-group row">
              <div className="col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  name="searchText"
                  placeholder="Search"
                  onBlur={handleBlur}
                  value={values.searchText}
                  onChange={(e) => {
                    setFieldValue("tag", "");
                    const { value } = e.target;
                    setFieldValue("searchText", value);
                    handleSubmit();
                  }}
                />
                <small className="form-text text-muted">
                  <b>Search</b> in all fields
                </small>
              </div>

              {/* <div className="col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  name="tag"
                  placeholder="Search tag"
                  onBlur={handleBlur}
                  value={values.tag}
                  onChange={(e) => {
                    setFieldValue("searchText", "");
                    const { value } = e.target;
                    setFieldValue("tag", value);
                    handleSubmit();
                  }}
                />
                <small className="form-text text-muted">
                  <b>Search</b> by tag
                </small>
              </div> */}
            </div>

            <div className="form-group row">
              <div className="col-lg-3">
                <select
                  className="form-control"
                  placeholder="Filter by catagories"
                  name="mainCatagory"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue("tag", "");
                    const { value } = e.target;
                    setMainCategoryId(value);
                    handleSubmit();
                  }}
                  // value={values.mainCatagory}
                  value={mainCategoryId}
                >
                  <option value=""></option>
                  {mainCatagories?.map((c) => (
                    <option value={c.id}>{c.name}</option>
                  ))}
                </select>
                <small className="form-text text-muted">
                  <b>Select</b> skill
                </small>
              </div>

              <div className="col-lg-3">
                <select
                  className="form-control"
                  placeholder="Filter by subCatagories"
                  name="subCatagories"
                  disabled={subCatagories?.length == 0}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue("tag", "");
                    const { value } = e.target;
                    setSubCategoryId(value);
                    handleSubmit();
                  }}
                  // value={values.subCatagories}
                  value={subCategoryId}
                >
                  <option value=""></option>
                  {subCatagories?.map((s) => (
                    <option value={s.id}>{s.name}</option>
                  ))}
                </select>
                <small className="form-text text-muted">
                  <b>Select</b> question type
                </small>
              </div>

              <div className="col-lg-3">
                <select
                  className="form-control"
                  placeholder="Filter by category"
                  name="categoryId"
                  disabled={subCatagorieslevel3?.length == 0}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue("tag", "");
                    const { value } = e.target;
                    setFieldValue("categoryId", value);
                    handleSubmit();
                  }}
                  value={values.categoryId}
                >
                  <option value=""></option>
                  {subCatagorieslevel3?.map((s) => (
                    <option value={s.id}>{s.name}</option>
                  ))}
                </select>
                <small className="form-text text-muted">
                  <b>Select</b> course type
                </small>
              </div>
              <div className="col-lg-2">
                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("searchText", "");
                    setFieldValue("categoryId", "");
                    setMainCategoryId("");
                    setSubCategoryId("");


                    dispatch(actions.fetchCourses({pageNumber: 1, pageSize : 10, sortField : "id", filter:{}}));
                  }}
                  className="btn btn-primary btn-elevate"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
