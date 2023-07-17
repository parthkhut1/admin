import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import SnackbarUtils from "./../../../notistack";
import { Formik, Form, Field } from "formik";
import Alert from "@material-ui/lab/Alert";

import {
  Input,
  Select,
  Switch,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";
import * as requestFromServer from "./../_redux/packagesCrud";
import SessionsTable from "../components/SessionsTable";
import * as actions from "../_redux/packagesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SelectInput from "react-select";
import { difference } from "lodash";
import { mergeFunctionWithId } from "../../../utility";

export default function AddSessionsTab({
  scopeId,
  comingSessions,
  sendSessions,
  packageId,
  sendSessionLimitation,
  comingPackage,
}) {
  const [sessionTitle, setSessionTitle] = useState("");
  const [tag, setTag] = useState("");

  const [isFree, setIsFree] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [values, setValues] = useState({});

  const { enqueueSnackbar } = useSnackbar();
  const [sessions, setSessions] = useState([]);
  const [limit, setLimit] = useState(0);

  // packages Redux state
  const dispatch = useDispatch();
  const { listLoading, filteredSessions } = useSelector(
    (state) => ({
      listLoading: state.packages.listLoading,
      filteredSessions: state.packages.filteredSessions,
    }),
    shallowEqual
  );

  useEffect(() => {
    const addTags = comingSessions?.map((i) => ({
      id: i.id,
      billable_id: i.billable_id,
      value: i.name,
      label: i.name,
    }));
    setSessions(addTags);
  }, [comingSessions]);

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

  useEffect(() => {
    sendSessionLimitation(limit);
  }, [limit]);

  useEffect(() => {
    setLimit(
      comingPackage?.scopes?.find((i) => i?.scope?.billable_type == "sessions")
        ?.limit
    );
  }, [comingPackage]);

  return (
    <>
      {/* <br />

      <Alert severity="warning">
        Attention! Please consider that you are able to set "Usage Limitation"
        only during the package creation and it could not be changed in the
        updating process.
      </Alert>

      <br />
      <div className="form-group row" style={{ marginTop: 10 }}>
        <div className="col-lg-4">
          <Field
            type="number"
            name="limit"
            disableValidation={true}
            min="0"
            component={Input}
            disabled={packageId}
            placeholder="Usage Limitation"
            label="Usage Limitation"
            onChange={(e) => {
              const { value } = e.target;
              setLimit(value);
            }}
            value={limit}
          />
        </div>
      </div> */}
      <div className="form-group row" style={{marginTop:30}}>
        <div className="col-lg-12">
          <label>Added Sessions</label>
          <br />
          <SelectInput
            value={sessions}
            isMulti
            name="colors"
            isSearchable={false}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(remainItems) => {
              const removingTags = difference(sessions, remainItems);
              dispatch(
                actions.removeBillFromScope(scopeId, [
                  removingTags[0].billable_id,
                ])
              );

              setSessions(remainItems);
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
          <label>Search Session Name</label>
          <input
            type="text"
            className="form-control"
            disabled={tag ? true : false}
            placeholder="Session Name"
            onChange={(e) => {
              const { value } = e.target;
              setSessionTitle(value);
            }}
          />
        </div>
      </div>

      <div className="form-group row">
        <div className="col-lg-4" style={{ marginTop: "20px" }}>
          <Select
            label="Sessions Teacher"
            value={teacher}
            mandatory={false}
            disabled={tag ? true : false}
            onChange={(e) => {
              const { value } = e.target;
              setTeacher(value);
            }}
          >
            <option value=""></option>
            {teachers?.map((teacher) => (
              <option
                key={teacher.id}
                value={`${teacher.id}`}
              >{`${teacher.name} , ${teacher.email}`}</option>
            ))}
          </Select>
        </div>

        <div className="col-lg-4" style={{ marginTop: "20px" }}>
          <Select
            label="Paid or Free"
            value={isFree}
            mandatory={false}
            disabled={tag ? true : false}
            onChange={(e) => {
              const { value } = e.target;
              setIsFree(value);
            }}
          >
            <option value=""></option>
            <option value="1">Free</option>
            <option value="0">Paid</option>
          </Select>
        </div>
        <div className="col-lg-4" style={{ marginTop: "20px" }}>
          <DatePickerField
            name="startedAt"
            label="Started at"
            disabled={tag ? true : false}
            captionHide={true}
            dateFormat="yyyy-MM-dd"
            sendDate={(date) => {
              console.log("data", format(date, "yyyy-MM-dd"));
              setStartedAt(format(date, "yyyy-MM-dd"));
            }}
          />
        </div>
      </div>

      <div className="form-group row">
        <div className="col-lg-6">
          <button
            onClick={() => {
              const values = {
                name: sessionTitle,
                is_free: isFree,
                teacher_id: teacher,
                started_at: startedAt,
                tag,
                per_page: 10,
                page: 1,
              };

              setValues(values);
              dispatch(actions.fetchFilteredSessions(values));
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
      <SessionsTable
        filterdSessions={filteredSessions}
        onAdd={(sessions) => {
          const addTags = sessions.map((i) => ({
            id: i.id,
            billable_id: i.billable_id,
            value: i.name,
            label: i.name,
          }));
          setSessions((prev) => {
            if (prev) return mergeFunctionWithId([...prev, ...addTags]);
            else return [...addTags];
          });
          if (scopeId) {
            dispatch(
              actions.addBillToScope(
                scopeId,
                sessions?.map((i) => i.billable_id)
              )
            );
            SnackbarUtils.success("Sessions added Successfully!");
          } else {
            sendSessions(sessions?.map((i) => i.billable_id));
          }
        }}
        filterValues={values}
      />
    </>
  );
}
