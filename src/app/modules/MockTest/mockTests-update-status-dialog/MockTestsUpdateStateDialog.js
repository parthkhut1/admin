import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MockTestStatusCssClasses } from "../MockTestsUIHelpers";
import * as actions from "../_redux/mockTestsActions";
import { useMockTestsUIContext } from "../MockTestsUIContext";

const selectedMockTests = (entities, ids) => {
  const _mockTests = [];
  ids.forEach((id) => {
    const mockTest = entities.find((el) => el.id === id);
    if (mockTest) {
      _mockTests.push(mockTest);
    }
  });
  return _mockTests;
};

export function MockTestsUpdateStateDialog({ show, onHide }) {
  // mockTests UI Context
  const mockTestsUIContext = useMockTestsUIContext();
  const mockTestsUIProps = useMemo(() => {
    return {
      ids: mockTestsUIContext.ids,
      setIds: mockTestsUIContext.setIds,
      queryParams: mockTestsUIContext.queryParams,
    };
  }, [mockTestsUIContext]);

  // mockTests Redux state
  const { mockTests, isLoading } = useSelector(
    (state) => ({
      mockTests: selectedMockTests(
        state.mockTests.entities,
        mockTestsUIProps.ids
      ),
      isLoading: state.mockTests.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!mockTestsUIProps.ids || mockTestsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestsUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update mockTests status by selected ids
    dispatch(actions.updateMockTestsStatus(mockTestsUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchMockTests(mockTestsUIProps.queryParams)).then(
          () => {
            // clear selections list
            mockTestsUIProps.setIds([]);
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
          Status has been updated for selected mockTests
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
          {mockTests.map((mockTest) => (
            <div
              className="timeline-item align-items-start"
              key={`mockTestsUpdate${mockTest.id}`}
            >
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    MockTestStatusCssClasses[mockTest.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                  className={`label label-lg label-light-${
                    MockTestStatusCssClasses[mockTest.status]
                  } label-inline`}
                >
                  ID: {mockTest.id}
                </span>
                <span className="ml-3">
                  {mockTest.lastName}, {mockTest.firstName}
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
