import React, { useState, useEffect } from "react";
import { Field } from "formik";
import { Input, Switch } from "../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/categoriesActions";

const CATEGORY_ID = 41;

const DashboardNotification = () => {
  const dispatch = useDispatch();
  const { notificationPost } = useSelector(
    (state) => ({
      notificationPost: state.studentDashboards.notificationPost,
    }),
    shallowEqual
  );
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [isShow, setIsShow] = useState(false);

  const handelSubmit = () => {
    if (notificationPost && notificationPost.length != 0)
      dispatch(
        actions.updatePost({
          id: notificationPost[0]?.id,
          title,
          text,
        })
      );
    else
      dispatch(
        actions.createPost({
          title,
          text,
          post_category_id: CATEGORY_ID,
          published_at: new Date(),
          is_featured: 1,
        })
      );
  };

  useEffect(() => {
    if (notificationPost && notificationPost.length != 0) {
      setText(notificationPost[0].text);
      setIsShow(notificationPost[0].title === "on" ? true : false);
    }
  }, [notificationPost]);

  useEffect(() => {
    dispatch(actions.fetchCategoryPosts(CATEGORY_ID, "notification"));
  }, []);
  return (
    <>
      <div className="form-group row"  style={{ marginTop: 40 }}>
        <div className="col-lg-12">
          <Field
            name="title"
            component={Switch}
            mandatory={false}
            label="Show notification in site: Hide/Show"
            checked={isShow}
            onChange={(e) => {
              const { checked } = e.target;
              setIsShow(checked);
              if (checked) setTitle("on");
              else setTitle("off");
            }}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-lg-12">
          <div className="form-group row">
            <div className="col-lg-10">
              <Field
                name="title"
                disableValidation={true}
                component={Input}
                placeholder="Dashboard Notification Text"
                label="Dashboard Notification Text"
                onChange={(e) => {
                  const { value } = e.target;
                  setText(value);
                }}
                value={text}
              />
            </div>
            <div
              className="col-lg-2"
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <button
                type="button"
                onClick={handelSubmit}
                className="btn btn-primary btn-elevate"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DashboardNotification;
