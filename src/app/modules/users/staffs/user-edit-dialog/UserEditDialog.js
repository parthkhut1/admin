import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/usersActions";
import { UserEditDialogHeader } from "./UserEditDialogHeader";
import { UserEditForm } from "./UserEditForm";
import { useUsersUIContext } from "../UsersUIContext";
import { useSnackbar } from "notistack";

export function UserEditDialog({ id, show, onHide }) {
  // users UI Context
  const { enqueueSnackbar } = useSnackbar();

  const usersUIContext = useUsersUIContext();
  const usersUIProps = useMemo(() => {
    return {
      initUser: usersUIContext.initUser,
    };
  }, [usersUIContext]);

  // users Redux state
  const dispatch = useDispatch();
  const { actionsLoading, userForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.staffs.actionsLoading,
      userForEdit: state.staffs.userForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting user by id
    dispatch(actions.fetchUser(id));
  }, [id, dispatch]);

  // server request for saving user
  const saveUser = (user, queryParams) => {
    const dto = {
      ...user,
      id,
    };

    if (!user.name)
      return enqueueSnackbar("Please write a name.", { variant: "error" });
    if (!id) {
      if (!user.email)
        return enqueueSnackbar("Please write a email.", { variant: "error" });
      if (!user.password)
        return enqueueSnackbar("Please write a password.", {
          variant: "error",
        });
      // server request for creating user
      dispatch(actions.createUser(dto)).then(() => {
        // refresh list after deletion

        dispatch(actions.fetchUsers(queryParams)).then(() => {
          // closing delete modal
          onHide();
        });
      });
    } else {
      // server request for updating user
      dispatch(actions.updateUser(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchUsers(queryParams)).then(() => {
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
      <UserEditDialogHeader id={id} />
      <UserEditForm
        saveUser={saveUser}
        actionsLoading={actionsLoading}
        user={userForEdit || usersUIProps.initUser}
        onHide={onHide}
      />
    </Modal>
  );
}
