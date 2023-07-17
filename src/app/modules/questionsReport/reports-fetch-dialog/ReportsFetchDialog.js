import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { ReportStatusCssClasses } from "../ReportsUIHelpers";
import { useReportsUIContext } from "../ReportsUIContext";

const selectedReports = (entities, ids) => {
  const _reports = [];
  ids.forEach((id) => {
    const report = entities.find((el) => el.id === id);
    if (report) {
      _reports.push(report);
    }
  });
  return _reports;
};

export function ReportsFetchDialog({ show, onHide }) {
  // reports UI Context
  const reportsUIContext = useReportsUIContext();
  const reportsUIProps = useMemo(() => {
    return {
      ids: reportsUIContext.ids,
    };
  }, [reportsUIContext]);

  // reports Redux state
  const { reports } = useSelector(
    (state) => ({
      reports: selectedReports(
        state.reports.entities,
        reportsUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if reports weren't selected we should close modal
  useEffect(() => {
    if (!reportsUIProps.ids || reportsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportsUIProps.ids]);

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
          {reports.map((report) => (
            <div className="timeline-item align-items-start" key={`id${report.id}`}>
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    ReportStatusCssClasses[report.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                    className={`label label-lg label-light-${
                      ReportStatusCssClasses[report.status]
                    } label-inline`}
                  >
                    ID: {report.id}
                </span>
                <span className="ml-3">{report.lastName}, {report.firstName}</span>                
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
