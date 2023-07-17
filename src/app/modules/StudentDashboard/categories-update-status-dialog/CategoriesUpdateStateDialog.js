import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { CategoryStatusCssClasses } from "../CategoriesUIHelpers";
import * as actions from "../_redux/categoriesActions";
import { useCategoriesUIContext } from "../CategoriesUIContext";

const selectedCategories = (entities, ids) => {
  const _categories = [];
  ids.forEach((id) => {
    const category = entities.find((el) => el.id === id);
    if (category) {
      _categories.push(category);
    }
  });
  return _categories;
};

export function CategoriesUpdateStateDialog({ show, onHide }) {
  // categories UI Context
  const categoriesUIContext = useCategoriesUIContext();
  const categoriesUIProps = useMemo(() => {
    return {
      ids: categoriesUIContext.ids,
      setIds: categoriesUIContext.setIds,
      queryParams: categoriesUIContext.queryParams,
    };
  }, [categoriesUIContext]);

  // categories Redux state
  const { categories, isLoading } = useSelector(
    (state) => ({
      categories: selectedCategories(
        state.studentDashboards.entities,
        categoriesUIProps.ids
      ),
      isLoading: state.studentDashboards.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!categoriesUIProps.ids || categoriesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update categories status by selected ids
    dispatch(actions.updateCategoriesStatus(categoriesUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchCategories(categoriesUIProps.queryParams)).then(
          () => {
            // clear selections list
            categoriesUIProps.setIds([]);
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
          Status has been updated for selected categories
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
          {categories.map((category) => (
            <div
              className="timeline-item align-items-start"
              key={`categoriesUpdate${category.id}`}
            >
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    CategoryStatusCssClasses[category.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                  className={`label label-lg label-light-${
                    CategoryStatusCssClasses[category.status]
                  } label-inline`}
                >
                  ID: {category.id}
                </span>
                <span className="ml-3">
                  {category.lastName}, {category.firstName}
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
