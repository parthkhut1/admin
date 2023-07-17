import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/scopesActions";
import { useScopesUIContext } from "../ScopesUIContext";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function ScopesDeleteDialog({ show, onHide }) {
  // scopes UI Context
  const scopesUIContext = useScopesUIContext();
  const scopesUIProps = useMemo(() => {
    return {
      ids: scopesUIContext.ids,
      setIds: scopesUIContext.setIds,
      queryParams: scopesUIContext.queryParams,
    };
  }, [scopesUIContext]);

  // scopes Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.scopes.actionsLoading }),
    shallowEqual
  );

  // if scopes weren't selected we should close modal
  useEffect(() => {
    if (!scopesUIProps.ids || scopesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopesUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteScopes = () => {
    // server request for deleting scope by selected ids
    dispatch(actions.deleteScopes(scopesUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchScopes(scopesUIProps.queryParams)).then(
        () => {
          // clear selections list
          scopesUIProps.setIds([]);
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
          Scopes Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to delete selected scopes?</span>
        )}
        {isLoading && <span>Scope are deleting...</span>}
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
            onClick={deleteScopes}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
