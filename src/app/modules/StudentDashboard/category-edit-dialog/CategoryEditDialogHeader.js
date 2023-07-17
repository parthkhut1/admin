import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function CategoryEditDialogHeader({ id }) {
  // categories Redux state
  const { categoryForEdit, actionsLoading } = useSelector(
    (state) => ({
      categoryForEdit: state.studentDashboards.categoryForEdit,
      actionsLoading: state.studentDashboards.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New category";
    if (categoryForEdit && id) {
      _title = `category id #${categoryForEdit.id}`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [categoryForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
