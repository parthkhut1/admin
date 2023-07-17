import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/scopesActions";
import { ScopeEditDialogHeader } from "./ScopeEditDialogHeader";
import { ScopeEditForm } from "./ScopeEditForm";
import { useScopesUIContext } from "../ScopesUIContext";
import { useSnackbar } from "notistack";

export function ScopeEditDialog({ id, show, onHide }) {
  // scopes UI Context
  const { enqueueSnackbar } = useSnackbar();

  const scopesUIContext = useScopesUIContext();
  const scopesUIProps = useMemo(() => {
    return {
      initScope: scopesUIContext.initScope,
    };
  }, [scopesUIContext]);

  // scopes Redux state
  const dispatch = useDispatch();
  const { actionsLoading, scopeForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.scopes.actionsLoading,
      scopeForEdit: state.scopes.scopeForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting scope by id
    dispatch(actions.fetchScope(id));
  }, [id, dispatch]);

  // server request for saving scope
  const saveScope = (scope, queryParams) => {
    const dto = {
      ...scope,
      id,
    };
    if (!id) {
      if (!scope.name)
        return enqueueSnackbar("Please write a name.", { variant: "error" });

      // server request for creating scope
      dispatch(actions.createScope(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchScopes(queryParams)).then(() => {
          // closing delete modal

          onHide();
        });
      });
    } else {

      // server request for updating scope
      dispatch(actions.updateScope(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchScopes(queryParams)).then(() => {
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
      <ScopeEditDialogHeader id={id} />
      <ScopeEditForm
        saveScope={saveScope}
        actionsLoading={actionsLoading}
        scope={scopeForEdit || scopesUIProps.initScope}
        onHide={onHide}
      />
    </Modal>
  );
}
