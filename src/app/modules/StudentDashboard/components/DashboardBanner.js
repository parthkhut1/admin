import React, { useMemo, useEffect, useState } from "react";
import { Field } from "formik";
import { Input, Switch } from "../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/categoriesActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useSnackbar } from "notistack";
import axios from "axios";

const CATEGORY_ID = 42;

const DashboardBanner = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { bannerPost } = useSelector(
    (state) => ({
      bannerPost: state.studentDashboards.bannerPost,
    }),
    shallowEqual
  );
  const [img, setImg] = useState("");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("on");
  const [url, setUrl] = useState("");
  const [isShow, setIsShow] = useState(false);

  const handleChangeStatus = async (e) => {
    setProgress(0);
    setImg("");
    const bodyFormData = new FormData();
    bodyFormData.append("file", e.target.files[0]);

    try {
      const response = await axios({
        method: "post",
        url: "/media",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: function(progressEvent) {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });
      setImg(response.data.payload.url);
      return response.data.payload.url;
    } catch (error) {
      setProgress(0);
      setImg("");
      document.getElementById("files-upload").value = null;
      return enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const handelSubmit = () => {
    if (bannerPost && bannerPost.length != 0)
      dispatch(
        actions.updatePost({
          id: bannerPost.find((i) => i.is_featured === 1)?.id,
          title,
          text: JSON.stringify({ img, url }),
        })
      );
    else
      dispatch(
        actions.createPost({
          title,
          text: JSON.stringify({ img, url }),
          post_category_id: CATEGORY_ID,
          published_at: new Date(),
          is_featured: 1,
        })
      );
  };

  useEffect(() => {
    if (bannerPost && bannerPost.length != 0) {
      const obj = JSON.parse(bannerPost.find((i) => i.is_featured === 1).text)
      setImg(obj.img);
      setIsShow(bannerPost[0].title === "on" ? true : false);
      setUrl(obj.url);
    }
  }, [bannerPost]);

  useEffect(() => {
    dispatch(actions.fetchCategoryPosts(CATEGORY_ID, "banner"));
  }, []);

  return (
    <>
      <div className="form-group row" style={{ marginTop: 40 }}>
        <div className="col-lg-12">
          <Field
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
        <div className="col-lg-10">
          <Field
            name="title"
            disableValidation={true}
            component={Input}
            placeholder="Write URL"
            label="URL: (This url use for redirecting when banner clicked.)"
            onChange={(e) => {
              const { value } = e.target;
              setUrl(value);
            }}
            value={url}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-lg-12">
          <div style={{ paddingBottom: "5px" }}>
            Upload Your File <span style={{ color: "red" }}>*</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <input
              type="file"
              id="files-upload"
              name="file"
              onChange={handleChangeStatus}
              accept="image/*"
            />
            {progress > 0 && <CircularProgressWithLabel value={progress} />}
          </div>
        </div>
      </div>
      {(bannerPost && bannerPost.length != 0) || img ? (
        <div className="form-group row">
          <div className="col-lg-12">
            <img src={img} style={{ width: "100%" }} />
          </div>
        </div>
      ) : null}
      <div className="form-group row">
        <div
          className="col-lg-2"
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <button
            type="button"
            onClick={handelSubmit}
            className="btn btn-primary btn-elevate"
            disabled={!img}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};
export default DashboardBanner;

const CircularProgressWithLabel = ({ value }) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={value} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
};
