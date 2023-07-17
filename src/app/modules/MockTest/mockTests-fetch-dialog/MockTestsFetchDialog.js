import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { MockTestStatusCssClasses } from "../MockTestsUIHelpers";
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

export function MockTestsFetchDialog({ show, onHide }) {
  // mockTests UI Context
  const mockTestsUIContext = useMockTestsUIContext();
  const mockTestsUIProps = useMemo(() => {
    return {
      ids: mockTestsUIContext.ids,
    };
  }, [mockTestsUIContext]);

  // mockTests Redux state
  const { mockTests } = useSelector(
    (state) => ({
      mockTests: selectedMockTests(
        state.mockTests.entities,
        mockTestsUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if mockTests weren't selected we should close modal
  useEffect(() => {
    if (!mockTestsUIProps.ids || mockTestsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestsUIProps.ids]);

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
          {mockTests.map((mockTest) => (
            <div className="timeline-item align-items-start" key={`id${mockTest.id}`}>
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
                <span className="ml-3">{mockTest.lastName}, {mockTest.firstName}</span>                
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
