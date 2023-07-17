import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ScopeStatusCssClasses } from "../ScopesUIHelpers";
import * as actions from "../_redux/scopesActions";
import { useScopesUIContext } from "../ScopesUIContext";

const selectedScopes = (entities, ids) => {
  const _scopes = [];
  ids.forEach((id) => {
    const scope = entities.find((el) => el.id === id);
    if (scope) {
      _scopes.push(scope);
    }
  });
  return _scopes;
};

export function ScopesUpdateStateDialog({ show, onHide }) {
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
  const { scopes, isLoading } = useSelector(
    (state) => ({
      scopes: selectedScopes(
        state.scopes.entities,
        scopesUIProps.ids
      ),
      isLoading: state.scopes.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!scopesUIProps.ids || scopesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopesUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update scopes status by selected ids
    dispatch(actions.updateScopesStatus(scopesUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchScopes(scopesUIProps.queryParams)).then(
          () => {
            // clear selections list
            scopesUIProps.setIds([]);
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
          Status has been updated for selected scopes
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
          {scopes.map((scope) => (
            <div
              className="timeline-item align-items-start"
              key={`scopesUpdate${scope.id}`}
            >
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    ScopeStatusCssClasses[scope.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                  className={`label label-lg label-light-${
                    ScopeStatusCssClasses[scope.status]
                  } label-inline`}
                >
                  ID: {scope.id}
                </span>
                <span className="ml-3">
                  {scope.lastName}, {scope.firstName}
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
