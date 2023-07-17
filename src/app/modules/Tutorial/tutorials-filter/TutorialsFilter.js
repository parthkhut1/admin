import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useTutorialsUIContext } from "../TutorialsUIContext";

const prepareFilter = (queryParams, values) => {
  const { status, type, searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  filter.lastName = searchText;
  if (searchText) {
    filter.email = searchText;
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

export function TutorialsFilter({ listLoading }) {
  // tutorials UI Context
  const tutorialsUIContext = useTutorialsUIContext();
  const tutorialsUIProps = useMemo(() => {
    return {
      queryParams: tutorialsUIContext.queryParams,
      setQueryParams: tutorialsUIContext.setQueryParams,
    };
  }, [tutorialsUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(tutorialsUIProps.queryParams, values);
    if (!isEqual(newQueryParams, tutorialsUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      tutorialsUIProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          status: "", // values => All=""/Susspended=0/Active=1/Pending=2
          type: "", // values => All=""/Business=0/Individual=1
          searchText: "",
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
                    setFieldValue("searchText", e.target.value);
                    handleSubmit();
                  }}
                />
                <small className="form-text text-muted">
                  <b>Search</b> in all fields
                </small>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
