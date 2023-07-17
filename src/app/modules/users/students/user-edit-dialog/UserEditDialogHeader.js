import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../../_metronic/_partials/controls";

export function UserEditDialogHeader({ id }) {
  // users Redux state
  const { userForEdit, actionsLoading } = useSelector(
    (state) => ({
      userForEdit: state.students.userForEdit,
      actionsLoading: state.students.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New Student";
    if (userForEdit && id) {
      _title = `Edit Student '${userForEdit.name}'`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [userForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
