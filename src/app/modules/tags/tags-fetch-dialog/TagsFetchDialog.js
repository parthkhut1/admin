import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { TagStatusCssClasses } from "../TagsUIHelpers";
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

export function TagsFetchDialog({ show, onHide }) {
  // tags UI Context
  const tagsUIContext = useTagsUIContext();
  const tagsUIProps = useMemo(() => {
    return {
      ids: tagsUIContext.ids,
    };
  }, [tagsUIContext]);

  // tags Redux state
  const { tags } = useSelector(
    (state) => ({
      tags: selectedTags(
        state.tags.entities,
        tagsUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if tags weren't selected we should close modal
  useEffect(() => {
    if (!tagsUIProps.ids || tagsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsUIProps.ids]);

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
          {tags.map((tag) => (
            <div className="timeline-item align-items-start" key={`id${tag.id}`}>
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
                <span className="ml-3">{tag.lastName}, {tag.firstName}</span>                
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
