import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/ticketsActions";
import { useTicketsUIContext } from "../TicketsUIContext";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function TicketsDeleteDialog({ show, onHide }) {
  // tickets UI Context
  const ticketsUIContext = useTicketsUIContext();
  const ticketsUIProps = useMemo(() => {
    return {
      ids: ticketsUIContext.ids,
      setIds: ticketsUIContext.setIds,
      queryParams: ticketsUIContext.queryParams,
    };
  }, [ticketsUIContext]);

  // tickets Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.tickets.actionsLoading }),
    shallowEqual
  );

  // if tickets weren't selected we should close modal
  useEffect(() => {
    if (!ticketsUIProps.ids || ticketsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketsUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteTickets = () => {
    // server request for deleting ticket by selected ids
    dispatch(actions.deleteTickets(ticketsUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchTickets(ticketsUIProps.queryParams)).then(
        () => {
          // clear selections list
          ticketsUIProps.setIds([]);
          // closing delete modal
          onHide();
        }
      );
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {/*begin::Loading*/}
      {isLoading && <ModalProgressBar />}
      {/*end::Loading*/}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Tickets Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to delete selected tickets?</span>
        )}
        {isLoading && <span>Ticket are deleting...</span>}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={deleteTickets}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
