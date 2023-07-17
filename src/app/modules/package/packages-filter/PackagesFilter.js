import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { usePackagesUIContext } from "../PackagesUIContext";

const prepareFilter = (queryParams, values) => {
  const { status, type, tag, searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};
  if (searchText) filter.email = searchText;
  if (tag) filter.tag = tag;
  newQueryParams.filter = filter;
  return newQueryParams;
};

export function PackagesFilter({ listLoading }) {
  // packages UI Context
  const packagesUIContext = usePackagesUIContext();
  const packagesUIProps = useMemo(() => {
    return {
      queryParams: packagesUIContext.queryParams,
      setQueryParams: packagesUIContext.setQueryParams,
    };
  }, [packagesUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(packagesUIProps.queryParams, values);
    if (!isEqual(newQueryParams, packagesUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      packagesUIProps.setQueryParams(newQueryParams);
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
                    setFieldValue("searchText", e.target.value);
                    handleSubmit();
                  }}
                />
                <small className="form-text text-muted">
                  <b>Search</b> in all fields
                </small>
              </div>
            </div>
            {/* <div className="form-group row">
              <div className="col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  name="tag"
                  placeholder="Search tag"
                  onBlur={handleBlur}
                  value={values.searchText}
                  onChange={(e) => {
                    setFieldValue("tag", e.target.value);
                    handleSubmit();
                  }}
                />
                <small className="form-text text-muted">
                  <b>Search</b> by tag
                </small>
              </div>
            </div> */}
          </form>
        )}
      </Formik>
    </>
  );
}
