import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/sessionsActions";
import { useSessionsUIContext } from "../SessionsUIContext";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";

export function SessionsDeleteDialog({ show, onHide }) {
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
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector(
    (state) => ({
      isLoading: state.sessions.actionsLoading,
      user: state.auth.user
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

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteSessions = () => {
    // server request for deleting session by selected ids
    dispatch(actions.deleteSessions(sessionsUIProps.ids)).then(() => {
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
          Sessions Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          // <span>Are you sure to delete selected sessions?</span>
          <span>Sesseion was canceled, you can not edit that.</span>
        )}
        {isLoading && <span>Session are deleting...</span>}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Close
          </button>
          <> </>
          {/* <button
            type="button"
            onClick={deleteSessions}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button> */}
        </div>
      </Modal.Footer>
    </Modal>
  );
}
