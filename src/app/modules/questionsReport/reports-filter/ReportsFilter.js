import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useReportsUIContext } from "../ReportsUIContext";

const prepareFilter = (queryParams, values) => {
  const { city, country } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  if (country) {
    filter.country = country;
  }
  if (city) {
    filter.city = city;
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

export function ReportsFilter({ listLoading }) {
  // reports UI Context
  const reportsUIContext = useReportsUIContext();
  const reportsUIProps = useMemo(() => {
    return {
      queryParams: reportsUIContext.queryParams,
      setQueryParams: reportsUIContext.setQueryParams,
    };
  }, [reportsUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(reportsUIProps.queryParams, values);
    if (!isEqual(newQueryParams, reportsUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      reportsUIProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          country: "",
          city: "",
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
                  name="country"
                  placeholder="Search"
                  onBlur={handleBlur}
                  value={values.country}
                  onChange={(e) => {
                    setFieldValue("country", e.target.value);
                    handleSubmit();
                  }}
                />
                <small className="form-text text-muted">
                  <b>Search</b> in country
                </small>
              </div>
              <div className="col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  placeholder="Search"
                  onBlur={handleBlur}
                  value={values.city}
                  onChange={(e) => {
                    setFieldValue("city", e.target.value);
                    handleSubmit();
                  }}
                />
                <small className="form-text text-muted">
                  <b>Search</b> in city
                </small>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
