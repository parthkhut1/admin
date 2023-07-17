import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useTicketsUIContext } from "../TicketsUIContext";

const prepareFilter = (queryParams, values) => {
  const { status, type, searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  filter.type = type !== "" ? type : undefined;
  filter.lastName = searchText;
  if (searchText) {
    filter.email = searchText;
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

export function TicketsFilter({ listLoading }) {
  // tickets UI Context
  const ticketsUIContext = useTicketsUIContext();
  const ticketsUIProps = useMemo(() => {
    return {
      queryParams: ticketsUIContext.queryParams,
      setQueryParams: ticketsUIContext.setQueryParams,
    };
  }, [ticketsUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(ticketsUIProps.queryParams, values);
    if (!isEqual(newQueryParams, ticketsUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      ticketsUIProps.setQueryParams(newQueryParams);
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
                <select
                  className="form-control"
                  placeholder="Filter by type"
                  name="type"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue("type", e.target.value);
                    handleSubmit();
                  }}
                  value={values.type}
                >
                  <option value="open-tickets">Open Tickets</option>
                  <option value="close-tickets">Close Tickets</option>
                  <option value="all">All</option>
                  <option value="trashed">Trashed Tickets</option>
                </select>
                <small className="form-text text-muted">
                  <b>Filter</b> by type
                </small>
              </div>
              {/* <div className="col-lg-4">
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
              </div> */}
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
