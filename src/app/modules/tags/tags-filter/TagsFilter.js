import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useTagsUIContext } from "../TagsUIContext";

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

export function TagsFilter({ listLoading }) {
  // tags UI Context
  const tagsUIContext = useTagsUIContext();
  const tagsUIProps = useMemo(() => {
    return {
      queryParams: tagsUIContext.queryParams,
      setQueryParams: tagsUIContext.setQueryParams,
    };
  }, [tagsUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(tagsUIProps.queryParams, values);
    if (!isEqual(newQueryParams, tagsUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      tagsUIProps.setQueryParams(newQueryParams);
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
