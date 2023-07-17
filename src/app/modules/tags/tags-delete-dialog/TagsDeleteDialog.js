import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/tagsActions";
import { useTagsUIContext } from "../TagsUIContext";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function TagsDeleteDialog({ show, onHide }) {
  // tags UI Context
  const tagsUIContext = useTagsUIContext();
  const tagsUIProps = useMemo(() => {
    return {
      ids: tagsUIContext.ids,
      setIds: tagsUIContext.setIds,
      queryParams: tagsUIContext.queryParams,
    };
  }, [tagsUIContext]);

  // tags Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.tags.actionsLoading }),
    shallowEqual
  );

  // if tags weren't selected we should close modal
  useEffect(() => {
    if (!tagsUIProps.ids || tagsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteTags = () => {
    // server request for deleting tag by selected ids
    dispatch(actions.deleteTags(tagsUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchTags(tagsUIProps.queryParams)).then(
        () => {
          // clear selections list
          tagsUIProps.setIds([]);
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
          Tags Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to delete selected tags?</span>
        )}
        {isLoading && <span>Tag are deleting...</span>}
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
            onClick={deleteTags}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
