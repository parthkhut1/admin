import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import * as actions from "../_redux/sessionsActions";
import { useSessionsUIContext } from "../SessionsUIContext";

export function SessionDeleteDialog({ id, show, onHide }) {
  // sessions UI Context
  const sessionsUIContext = useSessionsUIContext();
  const sessionsUIProps = useMemo(() => {
    return {
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

  // if !id we should close modal
  useEffect(() => {
    if (!id) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteSession = () => {
    // server request for deleting session by id
    dispatch(actions.deleteSession(id)).then(() => {
      // refresh list after deletion
      dispatch(
        actions.fetchSessions({
          ...sessionsUIProps.queryParams,
          isTeacher:
            user &&
            user?.roles?.length != 0 &&
            user?.roles?.findIndex((i) => i === "teacher") != -1
        })
      );
      // clear selections list
      sessionsUIProps.setIds([]);
      // closing delete modal
      onHide();
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
          session Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete this session?</span>
        )}
        {isLoading && <span>session is deleting...</span>}
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
            onClick={deleteSession}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
