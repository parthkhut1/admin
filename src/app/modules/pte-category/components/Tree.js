import React, { useEffect, useState } from "react";
import Open from "./Open";
import Close from "./Close";
import CloseInput from "./CloseInput";
import Pencil from "./Pencil";
import PencilOutline from "./PencilOutline";
import DeleteOutline from "./DeleteOutline";
import * as actions from "../_redux/categoriesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Input } from "../../../../_metronic/_partials/controls";
import { Field } from "formik";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ButtonToolbar, OverlayTrigger, Tooltip } from "react-bootstrap";

const Tree = ({ one }) => {
  const [show, setShow] = useState(false);
  const [showAddedInput, setShowAddedInput] = useState(false);
  const [showUpdatedInput, setShowUpdatedInput] = useState(false);
  const [Id, setId] = useState();
  const [newName, setNewName] = useState("");
  const [updatedName, setUpdatedName] = useState("");

  const dispatch = useDispatch();
  const { tree2, listLoading } = useSelector(
    (state) => ({
      tree: state.categories.tree,
      listLoading: state.categories.listLoading,
    }),
    shallowEqual
  );

  const mainBox = {
    width: "100%",
    padding: "5px 10px",
  };

  useEffect(() => {
    console.log("newName", newName);
  }, [newName]);

  useEffect(() => {
    console.log("updatedName", updatedName);
  }, [updatedName]);

  return (
    <>
      {one?.map((i) => (
        <>
          <div style={mainBox}>
            <div>
              {showUpdatedInput && i.id == Id ? (
                <InputGroup size="sm" className="mb-3" style={{ width: "60%" }}>
                  <InputGroup.Prepend>
                    <ButtonToolbar>
                      {/* {["top", "right", "bottom", "left"].map((placement) => ( */}
                      {["top"].map((placement) => (
                        <OverlayTrigger
                          key={placement}
                          placement={placement}
                          overlay={
                            <Tooltip id={`tooltip-${placement}-create`}>
                              {show && i.id == Id ? (
                                <strong>Close</strong>
                              ) : (
                                <strong>Open</strong>
                              )}
                            </Tooltip>
                          }
                        >
                          {show && i.id == Id ? (
                            <Button
                              variant="outline-secondary"
                              onClick={() => {
                                if (!i.childs || i.childs?.length == 0) {
                                  if (!listLoading)
                                    dispatch(actions.fetchTreeChild(i.id));
                                }
                                setId(i.id);
                                if (i.childs && i.childs?.length != 0)
                                  setShow(!show);
                              }}
                            >
                              <Close
                                width={16}
                                height={16}
                                color="#828282"
                                style={{ cursor: "pointer", marginRight: 3 }}
                              />
                            </Button>
                          ) : (
                            <Button
                              variant="outline-secondary"
                              onClick={() => {
                                if (!i.childs || i.childs?.length == 0) {
                                  if (!listLoading)
                                    dispatch(actions.fetchTreeChild(i.id));
                                }
                                setId(i.id);
                                if (i.childs && i.childs?.length != 0)
                                  setShow(!show);
                              }}
                            >
                              <Open
                                width={16}
                                height={16}
                                color="#828282"
                                style={{ cursor: "pointer", marginRight: 3 }}
                              />
                            </Button>
                          )}
                        </OverlayTrigger>
                      ))}
                    </ButtonToolbar>
                  </InputGroup.Prepend>
                  <Form.Control
                    style={{ height: 40, borderRadius: 5 }}
                    placeholder="Recipient's username"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={updatedName}
                    onChange={(e) => {
                      const { value } = e.target;
                      setUpdatedName(value);
                    }}
                  />
                  <InputGroup.Append>
                    <ButtonToolbar>
                      {/* {["top", "right", "bottom", "left"].map((placement) => ( */}
                      {["top"].map((placement) => (
                        <OverlayTrigger
                          key={placement}
                          placement={placement}
                          overlay={
                            <Tooltip id={`tooltip-${placement}-create`}>
                              <strong>Create Subcategory</strong>
                            </Tooltip>
                          }
                        >
                          <Button
                            data-tip
                            data-for="createTip"
                            variant="outline-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setId(i.id);
                              setShowAddedInput(!showAddedInput);
                            }}
                          >
                            <Pencil width={16} height={16} color="#828282" />
                          </Button>
                        </OverlayTrigger>
                      ))}
                    </ButtonToolbar>

                    <ButtonToolbar>
                      {/* {["top", "right", "bottom", "left"].map((placement) => ( */}
                      {["top"].map((placement) => (
                        <OverlayTrigger
                          key={placement}
                          placement={placement}
                          overlay={
                            <Tooltip id={`tooltip-${placement}-update`}>
                              <strong>Update Title</strong>
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="outline-secondary"
                            onClick={() => {
                              dispatch(
                                actions.updateTreeChild(i.id, updatedName)
                              );
                              dispatch(
                                actions.updateCategory({
                                  id: i.id,
                                  name: updatedName,
                                })
                              );
                            }}
                          >
                            <PencilOutline
                              width={16}
                              height={16}
                              color="#3699ff"
                            />
                          </Button>
                        </OverlayTrigger>
                      ))}
                    </ButtonToolbar>

                    <ButtonToolbar>
                      {/* {["top", "right", "bottom", "left"].map((placement) => ( */}
                      {["top"].map((placement) => (
                        <OverlayTrigger
                          key={placement}
                          placement={placement}
                          overlay={
                            <Tooltip id={`tooltip-${placement}-delete`}>
                              <strong>Delete Catagory</strong>
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="outline-secondary"
                            onClick={() => {
                              dispatch(
                                actions.deleteTreeChild(i.parent_id, i.id)
                              );
                              dispatch(actions.deleteCategory(i.id));
                            }}
                          >
                            <DeleteOutline
                              width={16}
                              height={16}
                              color="tomato"
                            />
                          </Button>
                        </OverlayTrigger>
                      ))}
                    </ButtonToolbar>

                    <ButtonToolbar>
                      {/* {["top", "right", "bottom", "left"].map((placement) => ( */}
                      {["top"].map((placement) => (
                        <OverlayTrigger
                          key={placement}
                          placement={placement}
                          overlay={
                            <Tooltip id={`tooltip-${placement}-delete`}>
                              <strong>Close</strong>
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="outline-secondary"
                            onClick={() => {
                              setShowUpdatedInput(false);
                              setShowAddedInput(false);
                            }}
                          >
                            <CloseInput
                              width={16}
                              height={16}
                              color="#303030"
                            />
                          </Button>
                        </OverlayTrigger>
                      ))}
                    </ButtonToolbar>
                  </InputGroup.Append>
                </InputGroup>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {/* {i.childs && i.childs?.length != 0 && ( */}
                  <div
                    onClick={() => {
                      if (!i.childs || i.childs?.length == 0) {
                        if (!listLoading)
                          dispatch(actions.fetchTreeChild(i.id));
                      }
                      setShowUpdatedInput(false);
                      setUpdatedName("");
                      setShowAddedInput(false)
                      setId(i.id);
                      setShow(!show);
                    }}
                  >
                    {show && i.id == Id ? (
                      <Close
                        width={18}
                        height={18}
                        color="#828282"
                        style={{ cursor: "pointer", marginRight: 3 }}
                      />
                    ) : (
                      <Open
                        width={18}
                        height={18}
                        color="#828282"
                        style={{ cursor: "pointer", marginRight: 3 }}
                      />
                    )}
                  </div>
                  {/* )} */}
                  <span
                    onClick={() => {
                      setId(i.id);
                      setUpdatedName(i.name);
                      setShowUpdatedInput(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {i.name}
                  </span>
                </div>
              )}

              <ul
                style={{
                  listStyleType: "none",
                  display: `${
                    show && i.id == Id && i.childs && i.childs?.length != 0
                      ? "block"
                      : "none"
                  }`,
                }}
              >
                {i.childs && i.childs?.length != 0 && (
                  <li>{<Tree one={i.childs} />}</li>
                )}
              </ul>
            </div>
            <div className="form-group row">
              {showAddedInput && i.id == Id && (
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
                      label=""
                    />
                  </div>
                  <div className="col-lg-2">
                    <button
                      onClick={() => {
                        dispatch(
                          actions.createCategory({
                            name: newName,
                            parent_id: i.id,
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
              )}
            </div>
          </div>
        </>
      ))}
    </>
  );
};

export default Tree;
