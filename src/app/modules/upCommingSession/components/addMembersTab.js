import React, { useMemo, useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { difference } from "lodash";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/sessionsActions";

import {
  findStudents,
  //   addBooking,
  //   deleteBooking,
} from "../_redux/sessionsCrud";

const AddMembersTab = ({ sessionId }) => {
  const [students, setStudents] = useState([]);

  // sessions Redux state
  const dispatch = useDispatch();
  const { sessionBookingList } = useSelector(
    (state) => ({
      sessionBookingList: state.sessions.sessionBookingList,
    }),
    shallowEqual
  );
  const filterStudents = async (inputValue) => {
    const {
      data: {
        payload: { data },
      },
    } = await findStudents(inputValue);

    const newData = data.map((i) => ({
      userId: i.id,
      value: i.name,
      label: i.name,
      email: i.email,
    }));
    return newData;
  };

  const promiseStudentsOptions = (inputValue) =>
    new Promise((resolve) => {
      resolve(filterStudents(inputValue));
    });

  return (
    <div style={{ marginTop: 40 }}>
      <div className="form-group row">
        <div className="col-lg-12">
          <span>For private session, teacher must add students manually.</span>
        </div>
      </div>
      <div className="form-group row">
        <div className="col-lg-12">
          <label>Students</label>
          <br />
          <AsyncSelect
            isMulti
            name="students"
            isClearable={false}
            cacheOptions
            defaultOptions
            loadOptions={promiseStudentsOptions}
            getOptionLabel={(option) =>
              `${option?.label ? `${option?.label} - ${option?.email}` : ""}`
            }
            getOptionValue={(option) => option.value}
            value={students}
            onChange={(value) => {
              console.log("students", students, "value", value);
              const deletedBooking = difference(students, value);
              setStudents(value);
              if (deletedBooking.length != 0) {
                dispatch(
                  actions.deleteBooking(sessionId, deletedBooking.pop()?.userId)
                );
              } else {
                dispatch(
                  actions.addBooking({
                    session_id: sessionId,
                    user_id: value[value?.length - 1].userId,
                  })
                );
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default AddMembersTab;
