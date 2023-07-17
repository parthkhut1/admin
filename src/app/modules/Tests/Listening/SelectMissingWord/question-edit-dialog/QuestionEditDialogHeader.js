import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../../../_metronic/_partials/controls";

export function QuestionEditDialogHeader({ id }) {
  // questions Redux state
  const { questionForEdit, actionsLoading } = useSelector(
    (state) => ({
      questionForEdit: state.selectMissingWords.questionForEdit,
      actionsLoading: state.selectMissingWords.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New Question";
    if (questionForEdit && id) {
      _title = `Edit Question '${questionForEdit.title}'`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [questionForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
