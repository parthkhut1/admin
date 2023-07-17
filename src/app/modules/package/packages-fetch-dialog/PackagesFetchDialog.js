import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { PackageStatusCssClasses } from "../PackagesUIHelpers";
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

export function PackagesFetchDialog({ show, onHide }) {
  // packages UI Context
  const packagesUIContext = usePackagesUIContext();
  const packagesUIProps = useMemo(() => {
    return {
      ids: packagesUIContext.ids,
    };
  }, [packagesUIContext]);

  // packages Redux state
  const { packages } = useSelector(
    (state) => ({
      packages: selectedPackages(
        state.packages.entities,
        packagesUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if packages weren't selected we should close modal
  useEffect(() => {
    if (!packagesUIProps.ids || packagesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packagesUIProps.ids]);

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
          {packages.map((dynamicPackage) => (
            <div className="timeline-item align-items-start" key={`id${dynamicPackage.id}`}>
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
                <span className="ml-3">{dynamicPackage.lastName}, {dynamicPackage.firstName}</span>                
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
