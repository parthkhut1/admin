import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { TutorialStatusCssClasses } from "../TutorialsUIHelpers";
import { useTutorialsUIContext } from "../TutorialsUIContext";

const selectedTutorials = (entities, ids) => {
  const _tutorials = [];
  ids.forEach((id) => {
    const tutorial = entities.find((el) => el.id === id);
    if (tutorial) {
      _tutorials.push(tutorial);
    }
  });
  return _tutorials;
};

export function TutorialsFetchDialog({ show, onHide }) {
  // tutorials UI Context
  const tutorialsUIContext = useTutorialsUIContext();
  const tutorialsUIProps = useMemo(() => {
    return {
      ids: tutorialsUIContext.ids,
    };
  }, [tutorialsUIContext]);

  // tutorials Redux state
  const { tutorials } = useSelector(
    (state) => ({
      tutorials: selectedTutorials(
        state.tutorials.entities,
        tutorialsUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if tutorials weren't selected we should close modal
  useEffect(() => {
    if (!tutorialsUIProps.ids || tutorialsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorialsUIProps.ids]);

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
          {tutorials.map((tutorial) => (
            <div className="timeline-item align-items-start" key={`id${tutorial.id}`}>
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    TutorialStatusCssClasses[tutorial.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                    className={`label label-lg label-light-${
                      TutorialStatusCssClasses[tutorial.status]
                    } label-inline`}
                  >
                    ID: {tutorial.id}
                </span>
                <span className="ml-3">{tutorial.lastName}, {tutorial.firstName}</span>                
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
