import React, { useMemo } from "react";
import { usePaymentsUIContext } from "../PaymentLogsUIContext";

export function PaymentsGrouping() {
  // Payments UI Context
  const paymentsUIContext = usePaymentsUIContext();
  const paymentsUIProps = useMemo(() => {
    return {
      ids: paymentsUIContext.ids,
      setIds: paymentsUIContext.setIds,
      openDeletePaymentsDialog: paymentsUIContext.openDeletePaymentsDialog,
      openFetchPaymentsDialog: paymentsUIContext.openFetchPaymentsDialog,
      openUpdatePaymentsStatusDialog:
        paymentsUIContext.openUpdatePaymentsStatusDialog,
    };
  }, [paymentsUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{paymentsUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              {/* <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={paymentsUIProps.openDeletePaymentsDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp; */}
              {/* <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={paymentsUIProps.openFetchPaymentsDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={paymentsUIProps.openUpdatePaymentsStatusDialog}
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
