import React, { useMemo } from "react";
import { useTicketsUIContext } from "../TicketsUIContext";

export function TicketsGrouping() {
  // tickets UI Context
  const ticketsUIContext = useTicketsUIContext();
  const ticketsUIProps = useMemo(() => {
    return {
      ids: ticketsUIContext.ids,
      setIds: ticketsUIContext.setIds,
      openDeleteTicketsDialog: ticketsUIContext.openDeleteTicketsDialog,
      openFetchTicketsDialog: ticketsUIContext.openFetchTicketsDialog,
      openUpdateTicketsStatusDialog:
        ticketsUIContext.openUpdateTicketsStatusDialog,
    };
  }, [ticketsUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{ticketsUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              {/* <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={ticketsUIProps.openDeleteTicketsDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp; */}
              {/* <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={ticketsUIProps.openFetchTicketsDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={ticketsUIProps.openUpdateTicketsStatusDialog}
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
