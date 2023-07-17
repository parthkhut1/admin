import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function ReportEditDialogHeader({ id }) {
  // reports Redux state
  const { reportForEdit, actionsLoading } = useSelector(
    (state) => ({
      reportForEdit: state.reports.reportForEdit,
      actionsLoading: state.reports.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New Report";
    if (reportForEdit && id) {
      _title = `Report id #${reportForEdit.id}`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [reportForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
