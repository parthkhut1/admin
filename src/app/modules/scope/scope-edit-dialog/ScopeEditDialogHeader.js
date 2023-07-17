import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function ScopeEditDialogHeader({ id }) {
  // scopes Redux state
  const { scopeForEdit, actionsLoading } = useSelector(
    (state) => ({
      scopeForEdit: state.scopes.scopeForEdit,
      actionsLoading: state.scopes.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New scope";
    if (scopeForEdit && id) {
      _title = `scope id #${scopeForEdit.id}`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [scopeForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
