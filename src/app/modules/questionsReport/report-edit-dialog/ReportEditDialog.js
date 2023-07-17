import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as reportsActions from "../_redux/reportsActions";
import { ReportEditDialogHeader } from "./ReportEditDialogHeader";
import { ReportEditForm } from "./ReportEditForm";
import { useReportsUIContext } from "../ReportsUIContext";
import { useSnackbar } from "notistack";

import { reportsSlice, callTypes } from "./../_redux/reportsSlice";

const { actions } = reportsSlice;

export function ReportEditDialog({ id, show, onHide }) {
  // reports UI Context
  const { enqueueSnackbar } = useSnackbar();

  const reportsUIContext = useReportsUIContext();
  const reportsUIProps = useMemo(() => {
    return {
      initReport: reportsUIContext.initReport,
    };
  }, [reportsUIContext]);

  // reports Redux state
  const dispatch = useDispatch();
  const { actionsLoading, reportForEdit, entities } = useSelector(
    (state) => ({
      actionsLoading: state.reports.actionsLoading,
      reportForEdit: state.reports.reportForEdit,
      entities: state.reports.entities,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting report by id
    dispatch(reportsActions.fetchReport(id));
  }, [id, dispatch]);

  // server request for saving report
  const saveReport = (report, queryParams) => {
    const dto = {
      ...report,
      id,
    };
    if (!id) {
      if (!report.name)
        return enqueueSnackbar("Please write a name.", { variant: "error" });

      // server request for creating report
      dispatch(reportsActions.createReport(dto)).then(() => {
        // refresh list after deletion
        dispatch(reportsActions.fetchReports(queryParams)).then(() => {
          // closing delete modal

          onHide();
        });
      });
    } else {
      // server request for updating report
      dispatch(reportsActions.updateReport(dto)).then(() => {
        // refresh list after deletion
        dispatch(reportsActions.fetchReports(queryParams)).then(() => {
          // closing delete modal
          onHide();
        });
      });
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <ReportEditDialogHeader id={id} />
      <ReportEditForm
        saveReport={saveReport}
        actionsLoading={actionsLoading}
        report={reportForEdit || reportsUIProps.initReport}
        onHide={onHide}
      />
    </Modal>
  );
}
