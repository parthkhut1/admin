import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function CourseEditDialogHeader({ id }) {
  // courses Redux state
  const { courseForEdit, actionsLoading } = useSelector(
    (state) => ({
      courseForEdit: state.courses.courseForEdit,
      actionsLoading: state.courses.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New course";
    if (courseForEdit && id) {
      _title = `course id #${courseForEdit.id}`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [courseForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
