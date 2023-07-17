import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function SessionEditDialogHeader({ id }) {
  // sessions Redux state
  const { sessionForEdit, actionsLoading } = useSelector(
    (state) => ({
      sessionForEdit: state.sessions.sessionForEdit,
      actionsLoading: state.sessions.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New Session";
    if (sessionForEdit && id) {
      _title = `Session id #${sessionForEdit.id}`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [sessionForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
