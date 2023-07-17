import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function TicketEditDialogHeader({ id }) {
  // tickets Redux state
  const { ticketForEdit, actionsLoading } = useSelector(
    (state) => ({
      ticketForEdit: state.tickets.ticketForEdit,
      actionsLoading: state.tickets.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New ticket";
    if (ticketForEdit && id) {
      _title = `Ticket id #${ticketForEdit.id}`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [ticketForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
