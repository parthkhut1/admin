import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import SnackbarUtils from "./../../../notistack";
import { Formik, Form, Field } from "formik";
import SelectInput from "react-select";
import { difference } from "lodash";

import {
  Input,
  Select,
  Switch,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";
import * as requestFromServer from "./../_redux/couponsCrud";
import MockTestsTable from "../components/MockTestsTable";
import * as actions from "../_redux/couponsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import {mergeFunctionWithId} from "../../../utility"

export default function AddMockTestsTab({ scopeId, comingMocks, sendMocks }) {
  const [mockTestTitle, setMockTestTitle] = useState("");
  const [tag, setTag] = useState("");
  const [values, setValues] = useState({});

  const [isFree, setIsFree] = useState("");
  const [valid_till, setValidTill] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const [mockTests, setMockTests] = useState([]);

  // packages Redux state
  const dispatch = useDispatch();
  const { listLoading, filteredMocks } = useSelector(
    (state) => ({
      listLoading: state.coupons.listLoading,
      filteredMocks: state.coupons.filteredMocks,
    }),
    shallowEqual
  );

  useEffect(() => {
    const addTags = comingMocks?.map((i) => ({
      id: i.id,
      billable_id: i.billable_id,
      value: i.name,
      label: i.name,
    }));
    setMockTests(addTags);
  }, [comingMocks]);

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
      <div className="form-group row" style={{ marginTop: 40 }}>
        <div className="col-lg-12">
          <label>Added Mock Tests</label>
          <br />
          <SelectInput
            value={mockTests}
            isMulti
            name="colors"
            isSearchable={false}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(remainItems) => {
              const removingTags = difference(mockTests, remainItems);
              dispatch(
                actions.removeBillFromScope(scopeId, [
                  removingTags[0].billable_id,
                ])
              );

              setMockTests(remainItems);
            }}
            noOptionsMessage={(str) => "To add items, please filter below."}
            placeholder="No items."
          />
        </div>
      </div>
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
          const addTags = mockTests.map((i) => ({
            id: i.id,
            billable_id: i.billable_id,
            value: i.name,
            label: i.name,
          }));
          setMockTests((prev) => {
            if (prev) return mergeFunctionWithId([...prev, ...addTags]);
            else return [...addTags];
          });
          if (scopeId) {
            dispatch(
              actions.addBillToScope(
                scopeId,
                mockTests?.map((i) => i.billable_id)
              )
            );
            SnackbarUtils.success("Mock tests added Successfully!");
          } else sendMocks(mockTests?.map((i) => i.billable_id));
        }}
        filterValues={values}
      />
    </>
  );
}
