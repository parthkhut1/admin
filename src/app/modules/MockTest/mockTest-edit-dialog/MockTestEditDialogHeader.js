import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function MockTestEditDialogHeader({ id }) {
  // mockTests Redux state
  const { mockTestForEdit, actionsLoading } = useSelector(
    (state) => ({
      mockTestForEdit: state.mockTests.mockTestForEdit,
      actionsLoading: state.mockTests.actionsLoading,
    }),
    shallowEqual
  );
  
  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New MockTest";
    if (mockTestForEdit && id) {
      _title = `Edit MockTest '${mockTestForEdit.name}'`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [mockTestForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
