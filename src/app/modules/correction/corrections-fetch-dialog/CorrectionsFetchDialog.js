import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { CorrectionStatusCssClasses } from "../CorrectionsUIHelpers";
import { useCorrectionsUIContext } from "../CorrectionsUIContext";

const selectedCorrections = (entities, ids) => {
  const _corrections = [];
  ids.forEach((id) => {
    const correction = entities.find((el) => el.id === id);
    if (correction) {
      _corrections.push(correction);
    }
  });
  return _corrections;
};

export function CorrectionsFetchDialog({ show, onHide }) {
  // corrections UI Context
  const correctionsUIContext = useCorrectionsUIContext();
  const correctionsUIProps = useMemo(() => {
    return {
      ids: correctionsUIContext.ids,
    };
  }, [correctionsUIContext]);

  // corrections Redux state
  const { corrections } = useSelector(
    (state) => ({
      corrections: selectedCorrections(
        state.corrections.entities,
        correctionsUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if corrections weren't selected we should close modal
  useEffect(() => {
    if (!correctionsUIProps.ids || correctionsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctionsUIProps.ids]);

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
          {corrections.map((correction) => (
            <div className="timeline-item align-items-start" key={`id${correction.id}`}>
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    CorrectionStatusCssClasses[correction.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                    className={`label label-lg label-light-${
                      CorrectionStatusCssClasses[correction.status]
                    } label-inline`}
                  >
                    ID: {correction.id}
                </span>
                <span className="ml-3">{correction.lastName}, {correction.firstName}</span>                
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
