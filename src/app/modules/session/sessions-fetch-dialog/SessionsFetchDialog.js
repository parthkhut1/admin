import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { SessionStatusCssClasses } from "../SessionsUIHelpers";
import { useSessionsUIContext } from "../SessionsUIContext";

const selectedSessions = (entities, ids) => {
  const _sessions = [];
  ids.forEach((id) => {
    const session = entities.find((el) => el.id === id);
    if (session) {
      _sessions.push(session);
    }
  });
  return _sessions;
};

export function SessionsFetchDialog({ show, onHide }) {
  // sessions UI Context
  const sessionsUIContext = useSessionsUIContext();
  const sessionsUIProps = useMemo(() => {
    return {
      ids: sessionsUIContext.ids,
    };
  }, [sessionsUIContext]);

  // sessions Redux state
  const { sessions } = useSelector(
    (state) => ({
      sessions: selectedSessions(
        state.sessions.entities,
        sessionsUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if sessions weren't selected we should close modal
  useEffect(() => {
    if (!sessionsUIProps.ids || sessionsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionsUIProps.ids]);

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
          {sessions.map((session) => (
            <div className="timeline-item align-items-start" key={`id${session.id}`}>
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    SessionStatusCssClasses[session.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                    className={`label label-lg label-light-${
                      SessionStatusCssClasses[session.status]
                    } label-inline`}
                  >
                    ID: {session.id}
                </span>
                <span className="ml-3">{session.lastName}, {session.firstName}</span>                
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
