import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PackageStatusCssClasses } from "../PackagesUIHelpers";
import * as actions from "../_redux/packagesActions";
import { usePackagesUIContext } from "../PackagesUIContext";

const selectedPackages = (entities, ids) => {
  const _packages = [];
  ids.forEach((id) => {
    const dynamicPackage = entities.find((el) => el.id === id);
    if (dynamicPackage) {
      _packages.push(dynamicPackage);
    }
  });
  return _packages;
};

export function PackagesUpdateStateDialog({ show, onHide }) {
  // packages UI Context
  const packagesUIContext = usePackagesUIContext();
  const packagesUIProps = useMemo(() => {
    return {
      ids: packagesUIContext.ids,
      setIds: packagesUIContext.setIds,
      queryParams: packagesUIContext.queryParams,
    };
  }, [packagesUIContext]);

  // packages Redux state
  const { packages, isLoading } = useSelector(
    (state) => ({
      packages: selectedPackages(
        state.packages.entities,
        packagesUIProps.ids
      ),
      isLoading: state.packages.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!packagesUIProps.ids || packagesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packagesUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update packages status by selected ids
    dispatch(actions.updatePackagesStatus(packagesUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchPackages(packagesUIProps.queryParams)).then(
          () => {
            // clear selections list
            packagesUIProps.setIds([]);
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
          Status has been updated for selected packages
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
          {packages.map((dynamicPackage) => (
            <div
              className="timeline-item align-items-start"
              key={`packagesUpdate${dynamicPackage.id}`}
            >
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    PackageStatusCssClasses[dynamicPackage.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                  className={`label label-lg label-light-${
                    PackageStatusCssClasses[dynamicPackage.status]
                  } label-inline`}
                >
                  ID: {dynamicPackage.id}
                </span>
                <span className="ml-3">
                  {dynamicPackage.lastName}, {dynamicPackage.firstName}
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
