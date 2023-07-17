import React, { useMemo } from "react";
import { useSessionsUIContext } from "../SessionsUIContext";

export function SessionsGrouping() {
  // sessions UI Context
  const sessionsUIContext = useSessionsUIContext();
  const sessionsUIProps = useMemo(() => {
    return {
      ids: sessionsUIContext.ids,
      setIds: sessionsUIContext.setIds,
      openDeleteSessionsDialog: sessionsUIContext.openDeleteSessionsDialog,
      openFetchSessionsDialog: sessionsUIContext.openFetchSessionsDialog,
      openUpdateSessionsStatusDialog:
        sessionsUIContext.openUpdateSessionsStatusDialog,
    };
  }, [sessionsUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{sessionsUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              {/* <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={sessionsUIProps.openDeleteSessionsDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp; */}
              {/* <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={sessionsUIProps.openFetchSessionsDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={sessionsUIProps.openUpdateSessionsStatusDialog}
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
