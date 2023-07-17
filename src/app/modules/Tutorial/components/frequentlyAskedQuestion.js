import React, { useMemo, useEffect, useState } from "react";
import {
  Input,
  DatePickerField,
  Switch,
  Textarea,
} from "../../../../_metronic/_partials/controls";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";

import Accordion from "react-bootstrap/Accordion";
import * as actions from "../_redux/tutorialsActions";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";

const FrequentlyAskedQuestion = ({ tutorial }) => {
  const [postId, setPostId] = useState(0);
  const [show, setShow] = useState(false);

  // tutorials Redux state
  const dispatch = useDispatch();
  const { posts, actionsLoading } = useSelector(
    (state) => ({
      posts: state.tutorials.posts,
      actionsLoading: state.tutorials.actionsLoading,
    }),
    shallowEqual
  );

  const handleDelete = () => {
    dispatch(actions.deletePost(postId));
    if (!actionsLoading) setShow(false);
  };
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const saveChanges = (values, post) => {
    if (!post.id) {
      dispatch(actions.createPost(post));
    } else {
      dispatch(actions.updatePost(post));
      setPostId(0);
    }
    values.title = "";
    values.text = "";
  };



  return (
    <Formik
      initialValues={{ title: "", text: "" }}
      onSubmit={(values) => {
        const post = {
          title: values.title,
          text: values.text,
          post_category_id: tutorial.category.id,
          published_at: new Date(),
          is_featured: 0,
        };
        if (postId) post["id"] = postId;

        saveChanges(values, post);
      }}
    >
      {({ handleSubmit, values, setFieldValue, setFieldTouched }) => (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure to delete this question?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
          <Accordion defaultActiveKey="0" style={{ marginTop: 40 }}>
            {posts?.length != 0
              ? posts?.map(
                  (q, index) =>
                    q.is_featured != 1 && (
                      <Card key={`${q.title}${index}`}>
                        <Accordion.Toggle
                          as={Card.Header}
                          eventKey={index.toString()}
                          style={{
                            height: 50,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              color: "#3F4254",
                              marginLeft: 15,
                              fontWeight: 500,
                              textDecoration: "none",
                            }}
                          >
                            {`${q.title}`}
                          </div>
                          <div style={{ marginRight: 15 }}>
                            <span
                              className="svg-icon svg-icon-md svg-icon-primary"
                              style={{ marginLeft: 10 }}
                              onClick={() => {
                                values.title = q.title;
                                values.text = q.text;
                                setPostId(q.id);
                              }}
                            >
                              <SVG
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/Communication/Write.svg"
                                )}
                              />
                            </span>
                            <span
                              className="svg-icon svg-icon-md svg-icon-danger"
                              style={{ marginLeft: 10 }}
                              onClick={() => {
                                setPostId(q.id);
                                handleShow();
                              }}
                            >
                              <SVG
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/General/Trash.svg"
                                )}
                              />
                            </span>
                          </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={index.toString()}>
                          <Card.Body>{q.text}</Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    )
                )
              : null}
          </Accordion>
          <Form style={{ marginTop: 40 }}>
            <div className="form-group row">
              <div className="col-lg-12">
                <Field
                  type="text"
                  name="title"
                  mandatory={true}
                  component={Input}
                  disableValidation={true}
                  placeholder="Question title"
                  label="Question title"
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-lg-12" style={{ marginTop: "20px" }}>
                <Field
                  name="text"
                  component={Textarea}
                  mandatory={true}
                  placeholder="Question Text"
                  label="Question Text"
                  rows={10}
                  cols={20}
                />
              </div>
            </div>
          </Form>
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-success btn-elevate"
          >
            {postId != 0 ? "Update" : "Add"}
          </button>
          {postId != 0 ? (
            <button
              type="button"
              onClick={() => {
                setPostId(0);
                values.title = "";
                values.text = "";
              }}
              style={{
                marginLeft: 20,
              }}
              className="btn btn-light btn-elevate"
            >
              Cancel
            </button>
          ) : null}
        </>
      )}
    </Formik>
  );
};
export default FrequentlyAskedQuestion;












