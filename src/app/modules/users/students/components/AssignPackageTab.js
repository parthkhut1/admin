import React, { useMemo, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/usersActions";
import { Select } from "../../../../../_metronic/_partials/controls";
import { useSnackbar } from "notistack";

const AssignPackageTab = ({ userId }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [packageId, setPackageId] = useState("");

  const { packagesList } = useSelector(
    (state) => ({
      packagesList: state.packages.entities,
    }),
    shallowEqual
  );


  return (
    <>
      <div className="form-group row" style={{ marginTop: 30 }}>
        <div className="col-lg-6">
          <Select
            // name="package"
            label="Package"
            onChange={(e) => {
              const { value } = e.target;
              setPackageId(value);
            }}
            value={packageId}
          >
            <option value=""></option>
            {packagesList && packagesList.length != 0
              ? packagesList.map((p) => <option value={p.id}>{p.name}</option>)
              : null}
          </Select>
        </div>
      </div>
      <div className="form-group row">
        <div className="col-lg-6">
          <button
            type="button"
            onClick={() => {
              if (packageId)
                dispatch(
                  actions.assignPackage({
                    packageId: packageId,
                    userId,
                  })
                );
              else
                enqueueSnackbar("Please select a package.", {
                  variant: "error",
                });
            }}
            className="btn btn-success btn-elevate"
          >
            Assign Selected Package To User
          </button>
        </div>
      </div>
    </>
  );
};

export default AssignPackageTab;
