import React, { useMemo } from "react";
import { useQuestionsUIContext } from "../QuestionsUIContext";

export function QuestionsGrouping() {
  // Questions UI Context
  const questionsUIContext = useQuestionsUIContext();
  const questionsUIProps = useMemo(() => {
    return {
      ids: questionsUIContext.ids,
      setIds: questionsUIContext.setIds,
      openDeleteQuestionsDialog: questionsUIContext.openDeleteQuestionsDialog,
      openFetchQuestionsDialog: questionsUIContext.openFetchQuestionsDialog,
      openUpdateQuestionsStatusDialog:
        questionsUIContext.openUpdateQuestionsStatusDialog,
    };
  }, [questionsUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{questionsUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={questionsUIProps.openDeleteQuestionsDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp;
              {/* <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={questionsUIProps.openFetchQuestionsDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={questionsUIProps.openUpdateQuestionsStatusDialog}
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
