import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/ticketsActions";
import { TicketEditDialogHeader } from "./TicketEditDialogHeader";
import { TicketEditForm } from "./TicketEditForm";
import { useTicketsUIContext } from "../TicketsUIContext";
import { useSnackbar } from "notistack";

export function TicketEditDialog({ id, show, onHide }) {
  // tickets UI Context
  const { enqueueSnackbar } = useSnackbar();

  const ticketsUIContext = useTicketsUIContext();
  const ticketsUIProps = useMemo(() => {
    return {
      initTicket: ticketsUIContext.initTicket,
    };
  }, [ticketsUIContext]);

  // tickets Redux state
  const dispatch = useDispatch();
  const { actionsLoading, ticketForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.tickets.actionsLoading,
      ticketForEdit: state.tickets.ticketForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting ticket by id
    dispatch(actions.fetchTicket(id));
  }, [id, dispatch]);

  // server request for saving ticket
  const saveTicket = (ticket, queryParams) => {
    const dto = {
      ...ticket,
      id,
    };
    if (!id) {
      if (!ticket.caption)
        return enqueueSnackbar("Please write a caption.", { variant: "error" });
      if (!ticket.category)
        return enqueueSnackbar("Please select a category.", {
          variant: "error",
        });
      if (!ticket.priority)
        return enqueueSnackbar("Please select a priority.", {
          variant: "error",
        });
      if (!ticket.user)
        return enqueueSnackbar("Please select a user.", { variant: "error" });

      // server request for creating ticket
      dispatch(actions.createTicket(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchTickets(queryParams)).then(() => {
          // closing delete modal

          onHide();
        });
      });
    } else {
      // server request for updating ticket
      dispatch(actions.updateTicket(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchTickets(queryParams)).then(() => {
          // closing delete modal
          onHide();
        });
      });
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <TicketEditDialogHeader id={id} />
      <TicketEditForm
        saveTicket={saveTicket}
        actionsLoading={actionsLoading}
        ticket={ticketForEdit || ticketsUIProps.initTicket}
        onHide={onHide}
      />
    </Modal>
  );
}
