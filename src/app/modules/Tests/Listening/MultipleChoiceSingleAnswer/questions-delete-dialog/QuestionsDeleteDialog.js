import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/questionsActions";
import { useQuestionsUIContext } from "../QuestionsUIContext";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function QuestionsDeleteDialog({ show, onHide }) {
  // questions UI Context
  const questionsUIContext = useQuestionsUIContext();
  const questionsUIProps = useMemo(() => {
    return {
      ids: questionsUIContext.ids,
      setIds: questionsUIContext.setIds,
      queryParams: questionsUIContext.queryParams,
    };
  }, [questionsUIContext]);

  // questions Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.lMultipleChoiceSingleAnswers.actionsLoading }),
    shallowEqual
  );

  // if questions weren't selected we should close modal
  useEffect(() => {
    if (!questionsUIProps.ids || questionsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteQuestions = () => {
    // server request for deleting Questions by selected ids
    dispatch(actions.deleteQuestions(questionsUIProps.ids)).then(
      () => {
        // refresh list after deletion
        dispatch(
          actions.fetchQuestions(questionsUIProps.queryParams)
        ).then(() => {
          // clear selections list
          questionsUIProps.setIds([]);
          // closing delete modal
          onHide();
        });
      }
    );
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
          Questions Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>
            Are you sure to delete selected Questions?
          </span>
        )}
        {isLoading && <span>Questions are deleting...</span>}
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
            onClick={deleteQuestions}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
