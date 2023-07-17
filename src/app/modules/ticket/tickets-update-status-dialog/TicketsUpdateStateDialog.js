import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { TicketStatusCssClasses } from "../TicketsUIHelpers";
import * as actions from "../_redux/ticketsActions";
import { useTicketsUIContext } from "../TicketsUIContext";

const selectedTickets = (entities, ids) => {
  const _tickets = [];
  ids.forEach((id) => {
    const ticket = entities.find((el) => el.id === id);
    if (ticket) {
      _tickets.push(ticket);
    }
  });
  return _tickets;
};

export function TicketsUpdateStateDialog({ show, onHide }) {
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
  const { tickets, isLoading } = useSelector(
    (state) => ({
      tickets: selectedTickets(
        state.tickets.entities,
        ticketsUIProps.ids
      ),
      isLoading: state.tickets.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!ticketsUIProps.ids || ticketsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketsUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update tickets status by selected ids
    dispatch(actions.updateTicketsStatus(ticketsUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchTickets(ticketsUIProps.queryParams)).then(
          () => {
            // clear selections list
            ticketsUIProps.setIds([]);
            // closing delete modal
            onHide();
          }
        );
      }
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Status has been updated for selected tickets
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="overlay overlay-block cursor-default">
        {/*begin::Loading*/}
        {isLoading && (
          <div className="overlay-layer">
            <div className="spinner spinner-lg spinner-primary" />
          </div>
        )}
        {/*end::Loading*/}

        <div className="timeline timeline-5 mt-3">
          {tickets.map((ticket) => (
            <div
              className="timeline-item align-items-start"
              key={`ticketsUpdate${ticket.id}`}
            >
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    TicketStatusCssClasses[ticket.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                  className={`label label-lg label-light-${
                    TicketStatusCssClasses[ticket.status]
                  } label-inline`}
                >
                  ID: {ticket.id}
                </span>
                <span className="ml-3">
                  {ticket.lastName}, {ticket.firstName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="form">
        <div className="form-group">
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(+e.target.value)}
          >
            <option value="0">Suspended</option>
            <option value="1">Active</option>
            <option value="2">Pending</option>
          </select>
        </div>
        <div className="form-group">
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate mr-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={updateStatus}
            className="btn btn-primary btn-elevate"
          >
            Update Status
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
