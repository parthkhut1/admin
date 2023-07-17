import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/categoriesActions";
import { CategoryEditDialogHeader } from "./CategoryEditDialogHeader";
import { CategoryEditForm } from "./CategoryEditForm";
import { useCategoriesUIContext } from "../CategoriesUIContext";
import { useSnackbar } from "notistack";

export function CategoryEditDialog({ id, show, onHide }) {
  // categories UI Context
  const { enqueueSnackbar } = useSnackbar();

  const categoriesUIContext = useCategoriesUIContext();
  const categoriesUIProps = useMemo(() => {
    return {
      initCategory: categoriesUIContext.initCategory,
      // initCategory: categoriesUIContext.initCategory,
    };
  }, [categoriesUIContext]);

  // categories Redux state
  const dispatch = useDispatch();
  const { actionsLoading, categoryForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.categories.actionsLoading,
      categoryForEdit: state.categories.categoryForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting category by id
    // dispatch(actions.fetchCategory(id));
  }, [id, dispatch]);

  // server request for saving category
  const saveCategory = (category, queryParams) => {
    const dto = {
      ...category,
      id,
    };

    if (category.delete) {
      if (!category.parent_id)
        return enqueueSnackbar("Please select a category.", {
          variant: "error",
        });
      onHide();
      return dispatch(actions.deleteCategory(category.parent_id));
    }
    if (category.update) {
      if (!category.parent_id)
        return enqueueSnackbar("Please select a category.", {
          variant: "error",
        });
      if (!category.name)
        return enqueueSnackbar("Please write a name.", { variant: "error" });
      onHide();
      return dispatch(
        actions.updateCategory({ id: category.parent_id, name: category.name })
      );
    }

    if (!id) {
      if (!category.name)
        return enqueueSnackbar("Please write a name.", { variant: "error" });

      // server request for creating category
      dispatch(actions.createCategory(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchCategories(queryParams)).then(() => {
          // closing delete modal

          onHide();
        });
      });
    } else {
      // server request for updating category
      dispatch(actions.updateCategory(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchCategories(queryParams)).then(() => {
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
      <CategoryEditDialogHeader id={id} />
      <CategoryEditForm
        saveCategory={saveCategory}
        actionsLoading={actionsLoading}
        category={categoriesUIProps.initCategory}
        // category={categoryForEdit || categoriesUIProps.initCategory}
        onHide={onHide}
      />
    </Modal>
  );
}
