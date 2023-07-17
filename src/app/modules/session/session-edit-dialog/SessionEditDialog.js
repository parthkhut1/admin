import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/sessionsActions";
import { SessionEditDialogHeader } from "./SessionEditDialogHeader";
import { SessionEditForm } from "./SessionEditForm";
import { useSessionsUIContext } from "../SessionsUIContext";
import { useSnackbar } from "notistack";

export function SessionEditDialog({ id, show, onHide }) {
  // sessions UI Context
  const { enqueueSnackbar } = useSnackbar();

  const sessionsUIContext = useSessionsUIContext();
  const sessionsUIProps = useMemo(() => {
    return {
      initSession: sessionsUIContext.initSession
    };
  }, [sessionsUIContext]);

  // sessions Redux state
  const dispatch = useDispatch();
  const { user, actionsLoading, sessionForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.sessions.actionsLoading,
      sessionForEdit: state.sessions.sessionForEdit,
      user: state.auth.user
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting session by id
    dispatch(actions.fetchSession(id));
  }, [id, dispatch]);

  // server request for saving session
  const saveSession = (session, queryParams) => {
    const dto = {
      ...session,
      id
    };
    if (!id) {
      if (!session.name)
        return enqueueSnackbar("Please write a name.", { variant: "error" });
      if (!session.description)
        return enqueueSnackbar("Please write a description.", {
          variant: "error"
        });
      if (!session.teacher)
        return enqueueSnackbar("Please select a teacher.", {
          variant: "error"
        });

      // server request for creating session
      dispatch(actions.createSession(dto)).then(() => {
        // refresh list after deletion
        dispatch(
          actions.fetchSessions({
            ...queryParams,
            isTeacher:
              user &&
              user?.roles?.length != 0 &&
              user?.roles?.findIndex((i) => i === "teacher") != -1
          })
        ).then(() => {
          // closing delete modal

          onHide();
        });
      });
    } else {
      // server request for updating session
      dispatch(actions.updateSession(dto)).then(() => {
        // refresh list after deletion
        dispatch(
          actions.fetchSessions({
            ...queryParams,
            isTeacher:
              user &&
              user?.roles?.length != 0 &&
              user?.roles?.findIndex((i) => i === "teacher") != -1
          })
        ).then(() => {
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
      <SessionEditDialogHeader id={id} />
      <SessionEditForm
        saveSession={saveSession}
        actionsLoading={actionsLoading}
        session={sessionForEdit || sessionsUIProps.initSession}
        onHide={onHide}
      />
    </Modal>
  );
}
