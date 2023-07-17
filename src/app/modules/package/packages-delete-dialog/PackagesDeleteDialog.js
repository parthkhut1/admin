import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/packagesActions";
import { usePackagesUIContext } from "../PackagesUIContext";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function PackagesDeleteDialog({ show, onHide }) {
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
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.packages.actionsLoading }),
    shallowEqual
  );

  // if packages weren't selected we should close modal
  useEffect(() => {
    if (!packagesUIProps.ids || packagesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packagesUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deletePackages = () => {
    // server request for deleting package by selected ids
    dispatch(actions.deletePackages(packagesUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchPackages(packagesUIProps.queryParams)).then(
        () => {
          // clear selections list
          packagesUIProps.setIds([]);
          // closing delete modal
          onHide();
        }
      );
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {/*begin::Loading*/}
      {isLoading && <ModalProgressBar />}
      {/*end::Loading*/}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Packages Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to delete selected packages?</span>
        )}
        {isLoading && <span>Packages are deleting...</span>}
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
            onClick={deletePackages}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
