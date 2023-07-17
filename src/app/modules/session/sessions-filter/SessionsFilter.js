import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useSessionsUIContext } from "../SessionsUIContext";

const prepareFilter = (queryParams, values) => {
  const { status, type, tag, searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  if (searchText) filter.email = searchText;
  if (tag) filter.tag = tag;

  newQueryParams.filter = filter;
  return newQueryParams;
};

export function SessionsFilter({ listLoading }) {
  // sessions UI Context
  const sessionsUIContext = useSessionsUIContext();
  const sessionsUIProps = useMemo(() => {
    return {
      queryParams: sessionsUIContext.queryParams,
      setQueryParams: sessionsUIContext.setQueryParams
    };
  }, [sessionsUIContext]);

  const { user } = useSelector(
    (state) => ({
      user: state.auth.user
    }),
    shallowEqual
  );

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(sessionsUIProps.queryParams, values);
    if (!isEqual(newQueryParams, sessionsUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      sessionsUIProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          status: "", // values => All=""/Susspended=0/Active=1/Pending=2
          type: "", // values => All=""/Business=0/Individual=1
          searchText: "",
          tag: ""
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
          setFieldValue
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

              {user &&
              user?.roles?.length != 0 &&
              user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
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
              ) : null}
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
