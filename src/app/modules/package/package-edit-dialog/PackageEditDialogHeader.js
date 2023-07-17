import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function PackageEditDialogHeader({ id }) {
  // packages Redux state
  const { packageForEdit, actionsLoading } = useSelector(
    (state) => ({
      packageForEdit: state.packages.packageForEdit,
      actionsLoading: state.packages.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New package";
    if (packageForEdit && id) {
      _title = `Package id #${packageForEdit.id}`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [packageForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
