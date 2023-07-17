import React, { useMemo } from "react";
import { useCorrectionsUIContext } from "../CorrectionsUIContext";

export function CorrectionsGrouping() {
  // corrections UI Context
  const correctionsUIContext = useCorrectionsUIContext();
  const correctionsUIProps = useMemo(() => {
    return {
      ids: correctionsUIContext.ids,
      setIds: correctionsUIContext.setIds,
      openDeleteCorrectionsDialog: correctionsUIContext.openDeleteCorrectionsDialog,
      openFetchCorrectionsDialog: correctionsUIContext.openFetchCorrectionsDialog,
      openUpdateCorrectionsStatusDialog:
        correctionsUIContext.openUpdateCorrectionsStatusDialog,
    };
  }, [correctionsUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{correctionsUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              {/* <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={correctionsUIProps.openDeleteCorrectionsDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp; */}
              {/* <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={correctionsUIProps.openFetchCorrectionsDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={correctionsUIProps.openUpdateCorrectionsStatusDialog}
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
