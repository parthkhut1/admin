import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { CategoryStatusCssClasses } from "../CategoriesUIHelpers";
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

export function CategoriesFetchDialog({ show, onHide }) {
  // categories UI Context
  const categoriesUIContext = useCategoriesUIContext();
  const categoriesUIProps = useMemo(() => {
    return {
      ids: categoriesUIContext.ids,
    };
  }, [categoriesUIContext]);

  // categories Redux state
  const { categories } = useSelector(
    (state) => ({
      categories: selectedCategories(
        state.categories.entities,
        categoriesUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if categories weren't selected we should close modal
  useEffect(() => {
    if (!categoriesUIProps.ids || categoriesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesUIProps.ids]);

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
          {categories.map((category) => (
            <div className="timeline-item align-items-start" key={`id${category.id}`}>
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
                <span className="ml-3">{category.lastName}, {category.firstName}</span>                
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
