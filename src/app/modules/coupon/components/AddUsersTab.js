import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import SnackbarUtils from "../../../notistack";
import { Formik, Form, Field } from "formik";
import { mergeFunctionWithId } from "../../../utility";
import AsyncSelect from "react-select/async";
import { difference } from "lodash";
import {
  attachTagToElement,
  detachTagToElement,
  findTags,
} from "../../../tagService";
import UserSelect from "react-select";

import {
  Input,
  Select,
  Switch,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";
import * as requestFromServer from "./../_redux/couponsCrud";
import UsersTable from "./UsersTable";
import * as actions from "../_redux/couponsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

export default function AddUsersTab({ sendUsers, sendTags }) {
  const [userTitle, setUserTitle] = useState("");
  const [tag, setTag] = useState("");
  const [values, setValues] = useState({});

  const [users, setUsers] = useState([]);
  const [userTags, setUserTags] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  // coupons Redux state
  const dispatch = useDispatch();
  const { listLoading, filteredUsers, couponForEdit } = useSelector(
    (state) => ({
      listLoading: state.coupons.listLoading,
      filteredUsers: state.coupons.filteredUsers,
      couponForEdit: state.coupons.couponForEdit,
    }),
    shallowEqual
  );

  const filterTags = async (inputValue) => {
    const {
      data: {
        payload: { data },
      },
    } = await findTags(inputValue);
    const newData = data.map((i) => ({
      id: i.id,
      value: i.name,
      label: i.name,
    }));
    return newData;
  };

  const promiseTagsOptions = (inputValue) =>
    new Promise((resolve) => {
      resolve(filterTags(inputValue));
    });

  useEffect(() => {
    sendTags(userTags);
  }, [userTags]);

  useEffect(() => {
    setUsers(
      couponForEdit?.users?.map((i) => ({
        id: i.id,
        value: `${i.name}-${i.email}`,
        label: `${i.name}-${i.email}`,
      }))
    );
    if (couponForEdit?.tags?.length !== 0)
      setUserTags(() =>
        couponForEdit?.tags?.map((i) => ({ value: i, label: i }))
      );
    else setUserTags([]);
  }, [couponForEdit]);

  return (
    <>
      <div className="form-group row" style={{ marginTop: 30 }}>
        <div className="col-lg-12">
          <label>Users</label>
          <br />
          <UserSelect
            value={users}
            isMulti
            name="colors"
            isSearchable={false}
            className="basic-multi-select"
            classNamePrefix="select"
            isClearable={false}
            onChange={(remainItems) => {
              const removingTags = difference(users, remainItems);
              // dispatch(
              //   actions.removeBillFromScope(values.id, [
              //     removingTags[0].billable_id,
              //   ])
              // );

              setUsers(remainItems);
              sendUsers(remainItems);
            }}
            noOptionsMessage={(str) =>
              "To add items, please refer to related tab at the topbar."
            }
            placeholder="No items."
          />
        </div>
      </div>

      <div className="form-group row">
        <div className="col-lg-12">
          <label>Users with tags:</label>
          <br />
          <AsyncSelect
            isMulti
            name="tags"
            cacheOptions
            defaultOptions
            loadOptions={promiseTagsOptions}
            getOptionLabel={(option) => `${option?.label ? option?.label : ""}`}
            getOptionValue={(option) => option.value}
            value={userTags}
            isClearable={false}
            onChange={(value) => {
              if (value) setUserTags(value);
              else setUserTags([]);
            }}
            // onBlur={() => setFieldTouched("users_tags", true)}
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
          <label>Search User Name</label>
          <input
            type="text"
            className="form-control"
            disabled={tag ? true : false}
            placeholder="User Name"
            onChange={(e) => {
              const { value } = e.target;
              setUserTitle(value);
            }}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-lg-6">
          <button
            onClick={() => {
              const values = {
                name: userTitle,
                tag,
                per_page: 10,
                page: 1,
              };

              setValues(values);
              dispatch(actions.fetchFilteredUsers(values));
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
      <UsersTable
        filterdUsers={filteredUsers}
        onAdd={(com_users) => {
          const addTags = com_users.map((i) => ({
            id: i.id,
            value: `${i.name}-${i.email}`,
            label: `${i.name}-${i.email}`,
          }));
          setUsers((prev) => {
            if (prev) return mergeFunctionWithId([...prev, ...addTags]);
            else return [...addTags];
          });
          sendUsers(mergeFunctionWithId([...users, ...addTags]));
          // SnackbarUtils.success("Users added Successfully!");
        }}
        filterValues={values}
      />
    </>
  );
}
