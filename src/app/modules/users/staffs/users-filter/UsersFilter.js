import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useUsersUIContext } from "../UsersUIContext";
import { format } from "date-fns";
import { DatePickerField } from "../../../../../_metronic/_partials/controls";

const prepareFilter = (queryParams, values) => {
  const { role, searchText, tag, creationDateFrom, creationDateTo } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};
  // Filter by role
  filter.roles = role !== "" ? role : undefined;

  // Filter by all fields
  if (searchText) filter.email = searchText;

  if (tag) filter.tag = tag;

  if (creationDateFrom) {
    filter.creationDateFrom = creationDateFrom;
  }

  if (creationDateTo) {
    filter.creationDateTo = creationDateTo;
  }

  newQueryParams.filter = filter;
  return newQueryParams;
};

export function UsersFilter({ listLoading }) {
  // Users UI Context
  const usersUIContext = useUsersUIContext();
  const usersUIProps = useMemo(() => {
    return {
      queryParams: usersUIContext.queryParams,
      setQueryParams: usersUIContext.setQueryParams,
    };
  }, [usersUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(usersUIProps.queryParams, values);
    if (!isEqual(newQueryParams, usersUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      usersUIProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          role: "",
          searchText: "",
          tag: "",
          creationDateFrom: "",
          creationDateTo: "",
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
                  placeholder="Filter by role"
                  name="role"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue("tag", "");
                    const { value } = e.target;
                    setFieldValue("role", value);
                    handleSubmit();
                  }}
                  value={values.role}
                >
                  <option value="all">All</option>
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super-admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="ticket-agent">Ticket-agent</option>
                </select>
                <small className="form-text text-muted">
                  <b>Filter</b> by role
                </small>
              </div>
              <div className="col-lg-4">
                <input
                  role="text"
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
                    setFieldValue("role", "all");

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
            <div className="form-group row">
              <div className="col-lg-4">
                <DatePickerField
                  name="creationDateFrom"
                  label="Sign-up From"
                  captionHide={true}
                  dateFormat="yyyy-MM-dd"
                  sendDate={(date) => {
                    setFieldValue(
                      "creationDateFrom",
                      format(date, "yyyy-MM-dd")
                    );
                    handleSubmit();
                  }}
                />
              </div>

              <div className="col-lg-4">
                <DatePickerField
                  name="creationDateTo"
                  label="Sign-up To"
                  captionHide={true}
                  dateFormat="yyyy-MM-dd"
                  sendDate={(date) => {
                    setFieldValue("creationDateTo", format(date, "yyyy-MM-dd"));
                    handleSubmit();
                  }}
                />
              </div>
              <div
                className="col-lg-2"
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("creationDateFrom", "");
                    setFieldValue("creationDateTo", "");
                    handleSubmit();
                  }}
                  className="btn btn-primary btn-elevate"
                >
                  Reset Dates
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
