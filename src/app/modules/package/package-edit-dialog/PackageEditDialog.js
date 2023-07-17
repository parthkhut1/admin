import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/packagesActions";
import { PackageEditDialogHeader } from "./PackageEditDialogHeader";
import { PackageEditForm } from "./PackageEditForm";
import { usePackagesUIContext } from "../PackagesUIContext";
import { useSnackbar } from "notistack";

export function PackageEditDialog({ id, show, onHide }) {
  // packages UI Context
  const { enqueueSnackbar } = useSnackbar();

  const packagesUIContext = usePackagesUIContext();
  const packagesUIProps = useMemo(() => {
    return {
      initPackage: packagesUIContext.initPackage,
    };
  }, [packagesUIContext]);

  // packages Redux state
  const dispatch = useDispatch();
  const { actionsLoading, packageForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.packages.actionsLoading,
      packageForEdit: state.packages.packageForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting package by id
    dispatch(actions.fetchPackage(id));
  }, [id, dispatch]);

  // server request for saving package
  const savePackage = (dynamicPackage, queryParams) => {
    const dto = {
      ...dynamicPackage,
      id,
    };

    if (!dynamicPackage?.name)
      return enqueueSnackbar("Please write a name.", { variant: "error" });
    if (dynamicPackage?.name.length < 2)
      return enqueueSnackbar(
        "The package name must be at least 3 characters.",
        {
          variant: "error",
        }
      );
    if (dynamicPackage?.description?.length == 0)
      return enqueueSnackbar("Please write at least a option.", {
        variant: "error",
      });

    if (!id) {
      // server request for creating package
      dispatch(actions.createScopes(dto)).then(() => {
        // refresh list after deletion
        // dispatch(actions.fetchPackages(queryParams)).then(() => {
        // closing delete modal

        onHide();
        // });
      });
    } else {
      // server request for updating package
      dispatch(actions.updatePackage(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchPackages(queryParams)).then(() => {
          // closing delete modal
          onHide();
        });
      });
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <PackageEditDialogHeader id={id} />
      <PackageEditForm
        savePackage={savePackage}
        actionsLoading={actionsLoading}
        dynamicPackage={packageForEdit || packagesUIProps.initPackage}
        onHide={onHide}
      />
    </Modal>
  );
}
