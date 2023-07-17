import React, { useState, useRef } from "react";
import { Field } from "formik";
import { Input } from "../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/categoriesActions";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";
import axios from "axios";
import PostVideo from "./StudyTourVideosItem";

const CATEGORY_ID = 43;
const StudyTourVideos = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const inputFileRef = useRef(null);

  const { videosPost } = useSelector(
    (state) => ({
      videosPost: state.studentDashboards.videosPost,
    }),
    shallowEqual
  );
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState("");
  const [link, setLink] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChangeStatusStudyTour = async (e) => {
    setProgress(0);
    setVideo("");
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
      setVideo(response.data.payload.url);
      setLink("");
      return response.data.payload.url;
    } catch (error) {
      setProgress(0);
      setVideo("");
      //   document.getElementById("files-upload").value = null;
      inputFileRef.current.value = "";
      return enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const handelSubmit = () => {
    const newPost = {
      title,
      text: video ? video : link,
      post_category_id: CATEGORY_ID,
      published_at: new Date(),
      is_featured: 0,
    };
    if (!newPost.title)
      return enqueueSnackbar("Title is required.", { variant: "error" });
    if (!newPost.text)
      return enqueueSnackbar("Video file or Video link is required.", {
        variant: "error",
      });
    dispatch(actions.createPost(newPost));
    dispatch(actions.createPostLocaly(newPost));
  };

  return (
    <>
      <div className="form-group row">
        <div className="col-lg-12">
          <Field
            name="title"
            disableValidation={true}
            mandatory={true}
            component={Input}
            placeholder="Video Title"
            label="Video Title"
            onChange={(e) => {
              const { value } = e.target;
              setTitle(value);
            }}
            value={title}
          />
        </div>
      </div>
      <div className="form-group row" style={{ marginTop: 40 }}>
        <div className="col-lg-6">
          <div style={{ paddingBottom: "5px" }}>
            Upload Study Tour Video <span style={{ color: "red" }}>*</span>
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
              onChange={handleChangeStatusStudyTour}
              accept="video/*"
            />
            {progress > 0 && <CircularProgressWithLabel value={progress} />}
          </div>
          <div>
            <button
              style={{ marginTop: 5 }}
              type="button"
              onClick={handelSubmit}
              className="btn btn-primary btn-elevate"
              disabled={!video && !link && !title}
            >
              Save
            </button>
          </div>
        </div>
        <div className="col-lg-6">
          <div style={{ paddingBottom: "5px" }}>
            Or Write Study Tour Video Link{" "}
            <span style={{ color: "red" }}>*</span>
          </div>
          <Field
            name="title"
            disableValidation={true}
            component={Input}
            hideEnterTitle={true}
            placeholder="Video Link"
            label="Video Link"
            onChange={(e) => {
              const { value } = e.target;
              setLink(value);
              setVideo("");
            }}
            value={link}
          />
        </div>
      </div>
      <ul
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          listStyle: "none",
          flexWrap: "wrap",
        }}
      >
        {videosPost &&
          videosPost
            .filter((i) => i.is_featured !== 1)
            .map((p) => (
              <li
                key={p.id}
                style={{
                  width: "32%",
                  marginRight: 5,
                  overflow: "hidden",
                  borderRadius: 5,
                  marginBottom: 40,
                }}
              >
                <PostVideo
                  post={p}
                  onDelete={(id) => dispatch(actions.deletePostLocaly(id))}
                  onUpdate={(post) => dispatch(actions.updatePostLocaly(post))}
                />
              </li>
            ))}
      </ul>
    </>
  );
};

export default StudyTourVideos;

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
