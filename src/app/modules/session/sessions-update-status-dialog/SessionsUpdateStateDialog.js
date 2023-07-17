import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SessionStatusCssClasses } from "../SessionsUIHelpers";
import * as actions from "../_redux/sessionsActions";
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

export function SessionsUpdateStateDialog({ show, onHide }) {
  // sessions UI Context
  const sessionsUIContext = useSessionsUIContext();
  const sessionsUIProps = useMemo(() => {
    return {
      ids: sessionsUIContext.ids,
      setIds: sessionsUIContext.setIds,
      queryParams: sessionsUIContext.queryParams
    };
  }, [sessionsUIContext]);

  // sessions Redux state
  const { user, sessions, isLoading } = useSelector(
    (state) => ({
      sessions: selectedSessions(state.sessions.entities, sessionsUIProps.ids),
      isLoading: state.sessions.actionsLoading,
      user: state.auth.user
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!sessionsUIProps.ids || sessionsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionsUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update sessions status by selected ids
    dispatch(actions.updateSessionsStatus(sessionsUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(
          actions.fetchSessions({
            ...sessionsUIProps.queryParams,
            isTeacher:
              user &&
              user?.roles?.length != 0 &&
              user?.roles?.findIndex((i) => i === "teacher") != -1
          })
        ).then(() => {
          // clear selections list
          sessionsUIProps.setIds([]);
          // closing delete modal
          onHide();
        });
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
          Status has been updated for selected sessions
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
          {sessions.map((session) => (
            <div
              className="timeline-item align-items-start"
              key={`sessionsUpdate${session.id}`}
            >
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
                <span className="ml-3">
                  {session.lastName}, {session.firstName}
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
