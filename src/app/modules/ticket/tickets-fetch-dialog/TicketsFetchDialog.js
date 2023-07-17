import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { TicketStatusCssClasses } from "../TicketsUIHelpers";
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

export function TicketsFetchDialog({ show, onHide }) {
  // tickets UI Context
  const ticketsUIContext = useTicketsUIContext();
  const ticketsUIProps = useMemo(() => {
    return {
      ids: ticketsUIContext.ids,
    };
  }, [ticketsUIContext]);

  // tickets Redux state
  const { tickets } = useSelector(
    (state) => ({
      tickets: selectedTickets(
        state.tickets.entities,
        ticketsUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if tickets weren't selected we should close modal
  useEffect(() => {
    if (!ticketsUIProps.ids || ticketsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketsUIProps.ids]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Fetch selected elements
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="timeline timeline-5 mt-3">
          {tickets.map((ticket) => (
            <div className="timeline-item align-items-start" key={`id${ticket.id}`}>
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
                <span className="ml-3">{ticket.lastName}, {ticket.firstName}</span>                
              </div>
            </div>
          ))}
        </div>
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
            onClick={onHide}
            className="btn btn-primary btn-elevate"
          >
            Ok
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
