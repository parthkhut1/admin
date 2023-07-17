import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { TagStatusCssClasses } from "../TagsUIHelpers";
import * as actions from "../_redux/tagsActions";
import { useTagsUIContext } from "../TagsUIContext";

const selectedTags = (entities, ids) => {
  const _tags = [];
  ids.forEach((id) => {
    const tag = entities.find((el) => el.id === id);
    if (tag) {
      _tags.push(tag);
    }
  });
  return _tags;
};

export function TagsUpdateStateDialog({ show, onHide }) {
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
  const { tags, isLoading } = useSelector(
    (state) => ({
      tags: selectedTags(
        state.tags.entities,
        tagsUIProps.ids
      ),
      isLoading: state.tags.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!tagsUIProps.ids || tagsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update tags status by selected ids
    dispatch(actions.updateTagsStatus(tagsUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchTags(tagsUIProps.queryParams)).then(
          () => {
            // clear selections list
            tagsUIProps.setIds([]);
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
          Status has been updated for selected tags
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
          {tags.map((tag) => (
            <div
              className="timeline-item align-items-start"
              key={`tagsUpdate${tag.id}`}
            >
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    TagStatusCssClasses[tag.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                  className={`label label-lg label-light-${
                    TagStatusCssClasses[tag.status]
                  } label-inline`}
                >
                  ID: {tag.id}
                </span>
                <span className="ml-3">
                  {tag.lastName}, {tag.firstName}
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
