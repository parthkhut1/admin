import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { CorrectionStatusCssClasses } from "../CorrectionsUIHelpers";
import * as actions from "../_redux/correctionsActions";
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

export function CorrectionsUpdateStateDialog({ show, onHide }) {
  // corrections UI Context
  const correctionsUIContext = useCorrectionsUIContext();
  const correctionsUIProps = useMemo(() => {
    return {
      ids: correctionsUIContext.ids,
      setIds: correctionsUIContext.setIds,
      queryParams: correctionsUIContext.queryParams,
    };
  }, [correctionsUIContext]);

  // corrections Redux state
  const { corrections, isLoading } = useSelector(
    (state) => ({
      corrections: selectedCorrections(
        state.corrections.entities,
        correctionsUIProps.ids
      ),
      isLoading: state.corrections.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!correctionsUIProps.ids || correctionsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctionsUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update corrections status by selected ids
    dispatch(actions.updateCorrectionsStatus(correctionsUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchCorrections(correctionsUIProps.queryParams)).then(
          () => {
            // clear selections list
            correctionsUIProps.setIds([]);
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
          Status has been updated for selected corrections
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
          {corrections.map((correction) => (
            <div
              className="timeline-item align-items-start"
              key={`correctionsUpdate${correction.id}`}
            >
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
                <span className="ml-3">
                  {correction.lastName}, {correction.firstName}
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
