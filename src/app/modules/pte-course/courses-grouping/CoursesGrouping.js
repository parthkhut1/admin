import React, { useMemo } from "react";
import { useCoursesUIContext } from "../CoursesUIContext";

export function CoursesGrouping() {
  // courses UI Context
  const coursesUIContext = useCoursesUIContext();
  const coursesUIProps = useMemo(() => {
    return {
      ids: coursesUIContext.ids,
      setIds: coursesUIContext.setIds,
      openDeleteCoursesDialog: coursesUIContext.openDeleteCoursesDialog,
      openFetchCoursesDialog: coursesUIContext.openFetchCoursesDialog,
      openUpdateCoursesStatusDialog:
        coursesUIContext.openUpdateCoursesStatusDialog,
    };
  }, [coursesUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{coursesUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              {/* <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={coursesUIProps.openDeleteCoursesDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp; */}
              {/* <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={coursesUIProps.openFetchCoursesDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={coursesUIProps.openUpdateCoursesStatusDialog}
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
