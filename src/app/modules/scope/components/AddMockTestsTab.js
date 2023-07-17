import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import SnackbarUtils from "./../../../notistack";
import { Formik, Form, Field } from "formik";

import {
  Input,
  Select,
  Switch,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";
import * as requestFromServer from "./../_redux/scopesCrud";
import MockTestsTable from "../components/MockTestsTable";
import * as actions from "../_redux/scopesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

export default function AddMockTestsTab({ sendMockTests }) {
  const [mockTestTitle, setMockTestTitle] = useState("");
  const [tag, setTag] = useState("");
  const [values, setValues] = useState({});

  const [isFree, setIsFree] = useState("");
  const [valid_till, setValidTill] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  // packages Redux state
  const dispatch = useDispatch();
  const { listLoading, filteredMocks } = useSelector(
    (state) => ({
      listLoading: state.scopes.listLoading,
      filteredMocks: state.scopes.filteredMocks,
    }),
    shallowEqual
  );

  useEffect(() => {
    requestFromServer
      .findTeacher()
      .then((response) => {
        const {
          payload: { data: findedTeachers },
        } = response.data;
        setTeachers(findedTeachers);
      })
      .catch((error) => {
        throw error;
      });
  }, []);
  return (
    <>
      <div className="form-group row" style={{ marginTop: 30 }}>
        <div className="col-lg-12">
          <label>Search By Tag</label>{" "}
          <span style={{ fontSize: 10, marginLeft: 20 }}>
            for searching by other filter, delete the tag
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Tag"
            onChange={(e) => {
              const { value } = e.target;
              setTag(value);
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 45,
        }}
      >
        <div
          style={{
            border: "1px solid #e4e6ef",
            width: "100%",
            marginRight: 12,
          }}
        ></div>
        <div>Or</div>
        <div
          style={{ border: "1px solid #e4e6ef", width: "100%", marginLeft: 12 }}
        ></div>
      </div>
      <div className="form-group row" style={{ marginTop: 30 }}>
        <div className="col-lg-12">
          <label>Search Mock Test Name</label>
          <input
            type="text"
            className="form-control"
            disabled={tag ? true : false}
            placeholder="Mock Test Name"
            onChange={(e) => {
              const { value } = e.target;
              setMockTestTitle(value);
            }}
          />
        </div>
      </div>
      {/* <div className="form-group row">
        <div className="col-lg-4" style={{ marginTop: "20px" }}>
          <Field
            name="valid_till"
            component={Switch}
            disabled={tag ? true : false}
            label="Valid till"
            onChange={(e) => {
              console.log(" e.target.checked", e.target.checked);
              setValidTill(e.target.checked);
            }}
          />
        </div>
      </div> */}

      <div className="form-group row">
        <div className="col-lg-6">
          <button
            onClick={() => {
              const values = {
                name: mockTestTitle,
                // valid_till: valid_till,
                valid_till: true,
                tag,
                per_page: 10,
                page: 1,
              };

              setValues(values);
              dispatch(actions.fetchFilteredMocks(values));
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
      <MockTestsTable
        filterdMockTests={filteredMocks}
        onAdd={(mockTests) => {
          sendMockTests(mockTests);
          SnackbarUtils.success("Mock tests added Successfully!");
        }}
        filterValues={values}
      />
    </>
  );
}
