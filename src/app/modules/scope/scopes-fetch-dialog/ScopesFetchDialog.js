import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { ScopeStatusCssClasses } from "../ScopesUIHelpers";
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

export function ScopesFetchDialog({ show, onHide }) {
  // scopes UI Context
  const scopesUIContext = useScopesUIContext();
  const scopesUIProps = useMemo(() => {
    return {
      ids: scopesUIContext.ids,
    };
  }, [scopesUIContext]);

  // scopes Redux state
  const { scopes } = useSelector(
    (state) => ({
      scopes: selectedScopes(
        state.scopes.entities,
        scopesUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if scopes weren't selected we should close modal
  useEffect(() => {
    if (!scopesUIProps.ids || scopesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopesUIProps.ids]);

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
          {scopes.map((scope) => (
            <div className="timeline-item align-items-start" key={`id${scope.id}`}>
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
                <span className="ml-3">{scope.lastName}, {scope.firstName}</span>                
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
