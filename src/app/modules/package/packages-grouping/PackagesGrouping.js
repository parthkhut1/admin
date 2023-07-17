import React, { useMemo } from "react";
import { usePackagesUIContext } from "../PackagesUIContext";

export function PackagesGrouping() {
  // packages UI Context
  const packagesUIContext = usePackagesUIContext();
  const packagesUIProps = useMemo(() => {
    return {
      ids: packagesUIContext.ids,
      setIds: packagesUIContext.setIds,
      openDeletePackagesDialog: packagesUIContext.openDeletePackagesDialog,
      openFetchPackagesDialog: packagesUIContext.openFetchPackagesDialog,
      openUpdatepackagesStatusDialog:
        packagesUIContext.openUpdatepackagesStatusDialog,
    };
  }, [packagesUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{packagesUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              {/* <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={packagesUIProps.openDeletePackagesDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp; */}
              {/* <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={packagesUIProps.openFetchPackagesDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={packagesUIProps.openUpdatepackagesStatusDialog}
              >
                <i className="fa fa-sync-alt"></i> Update Status
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
