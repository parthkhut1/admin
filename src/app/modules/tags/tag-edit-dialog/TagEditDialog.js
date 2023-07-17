import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as tagsActions from "../_redux/tagsActions";
import { TagEditDialogHeader } from "./TagEditDialogHeader";
import { TagEditForm } from "./TagEditForm";
import { useTagsUIContext } from "../TagsUIContext";
import { useSnackbar } from "notistack";

import { tagsSlice, callTypes } from "./../_redux/tagsSlice";

const { actions } = tagsSlice;

export function TagEditDialog({ id, show, onHide }) {
  // tags UI Context
  const { enqueueSnackbar } = useSnackbar();

  const tagsUIContext = useTagsUIContext();
  const tagsUIProps = useMemo(() => {
    return {
      initTag: tagsUIContext.initTag,
    };
  }, [tagsUIContext]);

  // tags Redux state
  const dispatch = useDispatch();
  const { actionsLoading, tagForEdit, entities } = useSelector(
    (state) => ({
      actionsLoading: state.tags.actionsLoading,
      tagForEdit: state.tags.tagForEdit,
      entities: state.tags.entities,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting tag by id
    // dispatch(tagsActions.fetchTag(tag));
    if (id) {
      const tag = entities?.find((tag) => tag.id == id);
      dispatch(actions.tagFetched({ tagForEdit: tag }));
    } else dispatch(actions.tagFetched({ tagForEdit: undefined }));
  }, [id, dispatch]);

  // server request for saving tag
  const saveTag = (tag, queryParams) => {
    const dto = {
      ...tag,
      id,
    };
    if (!id) {
      if (!tag.name)
        return enqueueSnackbar("Please write a name.", { variant: "error" });

      // server request for creating tag
      dispatch(tagsActions.createTag(dto)).then(() => {
        // refresh list after deletion
        dispatch(tagsActions.fetchTags(queryParams)).then(() => {
          // closing delete modal

          onHide();
        });
      });
    } else {
      // server request for updating tag
      dispatch(tagsActions.updateTag(dto)).then(() => {
        // refresh list after deletion
        dispatch(tagsActions.fetchTags(queryParams)).then(() => {
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
      <TagEditDialogHeader id={id} />
      <TagEditForm
        saveTag={saveTag}
        actionsLoading={actionsLoading}
        tag={tagForEdit || tagsUIProps.initTag}
        onHide={onHide}
      />
    </Modal>
  );
}
