import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { TutorialStatusCssClasses } from "../TutorialsUIHelpers";
import * as actions from "../_redux/tutorialsActions";
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

export function TutorialsUpdateStateDialog({ show, onHide }) {
  // tutorials UI Context
  const tutorialsUIContext = useTutorialsUIContext();
  const tutorialsUIProps = useMemo(() => {
    return {
      ids: tutorialsUIContext.ids,
      setIds: tutorialsUIContext.setIds,
      queryParams: tutorialsUIContext.queryParams,
    };
  }, [tutorialsUIContext]);

  // tutorials Redux state
  const { tutorials, isLoading } = useSelector(
    (state) => ({
      tutorials: selectedTutorials(
        state.tutorials.entities,
        tutorialsUIProps.ids
      ),
      isLoading: state.tutorials.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!tutorialsUIProps.ids || tutorialsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorialsUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update tutorials status by selected ids
    dispatch(actions.updateTutorialsStatus(tutorialsUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchTutorials(tutorialsUIProps.queryParams)).then(
          () => {
            // clear selections list
            tutorialsUIProps.setIds([]);
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
          Status has been updated for selected tutorials
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
          {tutorials.map((tutorial) => (
            <div
              className="timeline-item align-items-start"
              key={`tutorialsUpdate${tutorial.id}`}
            >
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
                <span className="ml-3">
                  {tutorial.lastName}, {tutorial.firstName}
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
