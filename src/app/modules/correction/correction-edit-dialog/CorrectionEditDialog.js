import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/correctionsActions";
import { CorrectionEditDialogHeader } from "./CorrectionEditDialogHeader";
import { CorrectionEditForm } from "./CorrectionEditForm";
import { useCorrectionsUIContext } from "../CorrectionsUIContext";
import { useSnackbar } from "notistack";

export function CorrectionEditDialog({ id, show, onHide }) {
  // corrections UI Context
  const { enqueueSnackbar } = useSnackbar();

  const correctionsUIContext = useCorrectionsUIContext();
  const correctionsUIProps = useMemo(() => {
    return {
      initCorrection: correctionsUIContext.initCorrection,
    };
  }, [correctionsUIContext]);

  // corrections Redux state
  const dispatch = useDispatch();
  const { actionsLoading, correctionForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.corrections.actionsLoading,
      correctionForEdit: state.corrections.correctionForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting correction by id
    dispatch(actions.fetchCorrection(id));
  }, [id, dispatch]);

  // server request for saving correction
  const saveCorrection = (correction, queryParams) => {
    const dto ={
      ...correction,
      id
    }
    if (id) {
  
      // server request for creating correction
      dispatch(actions.createCorrection(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchCorrections(queryParams)).then(() => {
          // closing delete modal
          
          onHide();
        })

      });
    } else {
      // server request for updating correction
      dispatch(actions.updateCorrection(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchCorrections(queryParams)).then(() => {
          // closing delete modal
          onHide();
        });
      })

    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
       <CorrectionEditDialogHeader id={id} />
      <CorrectionEditForm
        saveCorrection={saveCorrection}
        actionsLoading={actionsLoading}
        correction={correctionForEdit || correctionsUIProps.initCorrection}
        onHide={onHide}
      />
    </Modal>
  );
}
