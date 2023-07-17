import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import SnackbarUtils from "../../../notistack";

import {
  Input,
  Select,
  Switch,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";
import * as requestFromServer from "../_redux/couponsCrud";
import PackagesTable from "./PackagesTable";
import * as actions from "../_redux/couponsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SelectInput from "react-select";
import { difference } from "lodash";
import { mergeFunctionWithId } from "../../../utility";

export default function AddPackageTab({
  scopeId,
  comingPackages,
  sendPackages,
}) {
  const [sessionTitle, setSessionTitle] = useState("");
  const [tag, setTag] = useState("");

  const [isFree, setIsFree] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [values, setValues] = useState({});

  const { enqueueSnackbar } = useSnackbar();
  const [packages, setPackages] = useState([]);

  // packages Redux state
  const dispatch = useDispatch();
  const { listLoading, filteredPackages } = useSelector(
    (state) => ({
      listLoading: state.coupons.listLoading,
      filteredPackages: state.coupons.filteredPackages,
    }),
    shallowEqual
  );

  useEffect(() => {
    const addTags = comingPackages?.map((i) => ({
      id: i.id,
      billable_id: i.billable_id,
      value: i.name,
      label: i.name,
    }));
    setPackages(addTags);
  }, [comingPackages]);

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
          <label>Added Packages</label>
          <br />
          <SelectInput
            value={packages}
            isMulti
            name="colors"
            isSearchable={false}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(remainItems) => {
              const removingTags = difference(packages, remainItems);
              dispatch(
                actions.removeBillFromScope(scopeId, [
                  removingTags[0].billable_id,
                ])
              );

              setPackages(remainItems);
            }}
            noOptionsMessage={(str) => "To add items, please filter below."}
            placeholder="No items."
          />
        </div>
      </div>

      <div className="form-group row" style={{ marginTop: 30 }}>
        <div className="col-lg-12">
          <label>Search Package Name</label>
          <input
            type="text"
            className="form-control"
            disabled={tag ? true : false}
            placeholder="Package Name"
            onChange={(e) => {
              const { value } = e.target;
              setSessionTitle(value);
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
              dispatch(actions.fetchFilteredPackages(values));
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
      <PackagesTable
        filteredPackages={filteredPackages}
        onAdd={(packages) => {
          const addTags = packages.map((i) => ({
            id: i.id,
            billable_id: i.billable_id,
            value: i.name,
            label: i.name,
          }));
          setPackages((prev) => {
            if (prev) return mergeFunctionWithId([...prev, ...addTags]);
            else return [...addTags];
          });
          if (scopeId) {
            dispatch(
              actions.addBillToScope(
                scopeId,
                packages?.map((i) => i.billable_id)
              )
            );
            SnackbarUtils.success("Packages added Successfully!");
          } else sendPackages(packages?.map((i) => i.billable_id));
        }}
        filterValues={values}
      />
    </>
  );
}
