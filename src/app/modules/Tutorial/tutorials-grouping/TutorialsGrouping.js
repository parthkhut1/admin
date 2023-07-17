import React, { useMemo } from "react";
import { useTutorialsUIContext } from "../TutorialsUIContext";

export function TutorialsGrouping() {
  // tutorials UI Context
  const tutorialsUIContext = useTutorialsUIContext();
  const tutorialsUIProps = useMemo(() => {
    return {
      ids: tutorialsUIContext.ids,
      setIds: tutorialsUIContext.setIds,
      openDeleteTutorialsDialog: tutorialsUIContext.openDeleteTutorialsDialog,
      openFetchTutorialsDialog: tutorialsUIContext.openFetchTutorialsDialog,
      openUpdateTutorialsStatusDialog:
        tutorialsUIContext.openUpdateTutorialsStatusDialog,
    };
  }, [tutorialsUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{tutorialsUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              {/* <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={tutorialsUIProps.openDeleteTutorialsDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp; */}
              {/* <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={tutorialsUIProps.openFetchTutorialsDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={tutorialsUIProps.openUpdateTutorialsStatusDialog}
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
