import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useMockTestsUIContext } from "../MockTestsUIContext";

const prepareFilter = (queryParams, values) => {
  const { searchText, tag } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};
  if (searchText) filter.title = searchText;
  if (tag) filter.tag = tag;

  newQueryParams.filter = filter;
  return newQueryParams;
};

export function MockTestsFilter({ listLoading }) {
  // mockTests UI Context
  const mockTestsUIContext = useMockTestsUIContext();
  const mockTestsUIProps = useMemo(() => {
    return {
      queryParams: mockTestsUIContext.queryParams,
      setQueryParams: mockTestsUIContext.setQueryParams,
    };
  }, [mockTestsUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(mockTestsUIProps.queryParams, values);
    if (!isEqual(newQueryParams, mockTestsUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      mockTestsUIProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          status: "", // values => All=""/Susspended=0/Active=1/Pending=2
          type: "", // values => All=""/Business=0/Individual=1
          searchText: "",
          tag: "",
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
              <div className="col-lg-4">
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
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
