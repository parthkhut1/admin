// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import * as Yup from "yup";
import { format, parseISO } from "date-fns";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/categoriesActions";
import {
  Input,
  DatePickerField,
  Switch,
  Select,
} from "../../../../_metronic/_partials/controls";
import { useCategoriesUIContext } from "../CategoriesUIContext";

import Tree from "../components/Tree";
import Pencil from "../components/Pencil";

// Validation schema
const CategoryEditSchema = Yup.object().shape({});


export function CategoryEditForm({
  saveCategory,
  category,
  actionsLoading,
  onHide,
}) {
  const dispatch = useDispatch();
  const [isDelete, setIsDelete] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [newName, setNewName] = useState("");

  const { level0, level1, level2, tree } = useSelector(
    (state) => ({
      level0: state.categories.level0,
      level1: state.categories.level1,
      level2: state.categories.level2,
      tree: state.categories.tree,
    }),
    shallowEqual
  );
  const categoriesUIContext = useCategoriesUIContext();

  const categoriesUIProps = useMemo(() => {
    return {
      ids: categoriesUIContext.ids,
      setIds: categoriesUIContext.setIds,
      queryParams: categoriesUIContext.queryParams,
    };
  }, [categoriesUIContext]);

  // useEffect(() => {
  //   dispatch(actions.fetchCategoryChilds(0, 0));
  // }, []);
  useEffect(() => {
    dispatch(actions.fetchTreeChild(0));
  }, []);



  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={category}
        validationSchema={CategoryEditSchema}
        onSubmit={(values) => {
          const newValues = {
            delete: isDelete,
            update: isUpdate,
            name: values.name,
          };
          if (values.parentIdLevel0 == 0) newValues["parent_id"] = null;
          else if (values.parentIdLevel0 != 0 && values.parentIdLevel1 == 0)
            newValues["parent_id"] = values.parentIdLevel0;
          else if (
            values.parentIdLevel0 != 0 &&
            values.parentIdLevel1 != 0 &&
            values.parentIdLevel2 == 0
          )
            newValues["parent_id"] = values.parentIdLevel1;
          else if (
            values.parentIdLevel0 != 0 &&
            values.parentIdLevel1 != 0 &&
            values.parentIdLevel2 == 0
          )
            newValues["parent_id"] = values.parentIdLevel1;
          else if (
            values.parentIdLevel0 != 0 &&
            values.parentIdLevel1 != 0 &&
            values.parentIdLevel2 != 0
          )
            newValues["parent_id"] = values.parentIdLevel2;

          saveCategory(newValues, categoriesUIProps.queryParams);
        }}
      >
        {({ handleSubmit, values, setFieldValue, setFieldTouched }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div
                  className="overlay-layer bg-transparent"
                  style={{ zIndex: 10 }}
                >
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <Tabs defaultActiveKey="createcategory" onSelect={(e) => {}}>
                  <Tab eventKey="createcategory" title="Create category">
                    <div className="form-group row" style={{ marginTop: 40 }}>
                      <div className="col-lg-12">
                        <Tree one={tree} />
                        <hr />
                      </div>
                      <>
                        <div className="col-lg-5">
                          <Field
                            type="text"
                            name="namee"
                            mandatory={false}
                            hideEnterTitle={true}
                            component={Input}
                            disableValidation={true}
                            value={newName}
                            onChange={(e) => {
                              const { value } = e.target;
                              setNewName(value);
                            }}
                            placeholder="Category title"
                            label="Add Main Category"
                          />
                        </div>
                        <div
                          className="col-lg-2"
                          style={{ display: "flex", alignItems: "flex-end" }}
                        >
                          <button
                            onClick={() => {
                              dispatch(
                                actions.createCategory({
                                  name: newName,
                                })
                              );
                              setNewName("");
                            }}
                            className="btn btn-success btn-elevate"
                            type="button"
                          >
                            Add
                          </button>
                        </div>
                      </>
                    </div>
                  </Tab>
                </Tabs>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
                disabled={actionsLoading}
              >
                Close
              </button>
              <> </>
              {/* <button
                type="submit"
                onClick={handleSubmit}
                className={`btn btn-${
                  isDelete ? "danger" : "primary"
                } btn-elevate`}
                disabled={actionsLoading}
              >
                {isDelete ? "Delete" : "Save"}
              </button> */}
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
