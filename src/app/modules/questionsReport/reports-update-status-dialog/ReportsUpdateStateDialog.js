import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ReportStatusCssClasses } from "../ReportsUIHelpers";
import * as actions from "../_redux/reportsActions";
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

export function ReportsUpdateStateDialog({ show, onHide }) {
  // reports UI Context
  const reportsUIContext = useReportsUIContext();
  const reportsUIProps = useMemo(() => {
    return {
      ids: reportsUIContext.ids,
      setIds: reportsUIContext.setIds,
      queryParams: reportsUIContext.queryParams,
    };
  }, [reportsUIContext]);

  // reports Redux state
  const { reports, isLoading } = useSelector(
    (state) => ({
      reports: selectedReports(
        state.reports.entities,
        reportsUIProps.ids
      ),
      isLoading: state.reports.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!reportsUIProps.ids || reportsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportsUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update reports status by selected ids
    dispatch(actions.updateReportsStatus(reportsUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchReports(reportsUIProps.queryParams)).then(
          () => {
            // clear selections list
            reportsUIProps.setIds([]);
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
          Status has been updated for selected reports
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
          {reports.map((report) => (
            <div
              className="timeline-item align-items-start"
              key={`reportsUpdate${report.id}`}
            >
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
                <span className="ml-3">
                  {report.lastName}, {report.firstName}
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
