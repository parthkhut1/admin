import React, { useMemo } from "react";
import { useScopesUIContext } from "../ScopesUIContext";

export function ScopesGrouping() {
  // scopes UI Context
  const scopesUIContext = useScopesUIContext();
  const scopesUIProps = useMemo(() => {
    return {
      ids: scopesUIContext.ids,
      setIds: scopesUIContext.setIds,
      openDeleteScopesDialog: scopesUIContext.openDeleteScopesDialog,
      openFetchScopesDialog: scopesUIContext.openFetchScopesDialog,
      openUpdateScopesStatusDialog:
        scopesUIContext.openUpdateScopesStatusDialog,
    };
  }, [scopesUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{scopesUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              {/* <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={scopesUIProps.openDeleteScopesDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp; */}
              {/* <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={scopesUIProps.openFetchScopesDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={scopesUIProps.openUpdateScopesStatusDialog}
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
