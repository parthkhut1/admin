import React, { useMemo } from "react";
import { useMockTestsUIContext } from "../MockTestsUIContext";

export function MockTestsGrouping() {
  // mockTests UI Context
  const mockTestsUIContext = useMockTestsUIContext();
  const mockTestsUIProps = useMemo(() => {
    return {
      ids: mockTestsUIContext.ids,
      setIds: mockTestsUIContext.setIds,
      openDeleteMockTestsDialog: mockTestsUIContext.openDeleteMockTestsDialog,
      openFetchMockTestsDialog: mockTestsUIContext.openFetchMockTestsDialog,
      openUpdateMockTestsStatusDialog:
        mockTestsUIContext.openUpdateMockTestsStatusDialog,
    };
  }, [mockTestsUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{mockTestsUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              {/* <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={mockTestsUIProps.openDeleteMockTestsDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp; */}
              {/* <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={mockTestsUIProps.openFetchMockTestsDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={mockTestsUIProps.openUpdateMockTestsStatusDialog}
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
