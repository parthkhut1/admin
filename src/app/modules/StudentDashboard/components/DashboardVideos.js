import React, { useEffect, useState, useRef } from "react";
import { Field } from "formik";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Input } from "../../../../_metronic/_partials/controls";
import * as actions from "../_redux/categoriesActions";
import StudyTourVideosList from "./StudyTourVideosList";
import { parseVideoUrlToIframe } from "../../../utility";

const CATEGORY_ID = 43;

const DashboardBanner = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const inputRef = useRef(null);
  const videoRef = useRef(null);

  const { videosPost } = useSelector(
    (state) => ({
      videosPost: state.studentDashboards.videosPost,
    }),
    shallowEqual
  );
  const [video, setVideo] = useState("");
  const [link, setLink] = useState("");
  const [progress, setProgress] = React.useState(0);

  const handleChangeStatus = async (e) => {
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
      //   document.getElementById("files-upload")?.value = "";
      inputRef.current.value = "";
      return enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const handelSubmit = () => {
    if (videosPost && videosPost.length !== 0) {
      dispatch(
        actions.updatePost({
          id: videosPost.find((i) => i.is_featured === 1)?.id,
          text: video ? video : link,
        })
      );
    } else {
      dispatch(
        actions.createPost({
          title: "Smart Visor Video",
          text: video ? video : link,
          post_category_id: CATEGORY_ID,
          published_at: new Date(),
          is_featured: 1,
        })
      );
    }
  };

  useEffect(() => {
    if (videosPost && videosPost.length !== 0) {
      setVideo(videosPost.find((i) => i.is_featured === 1)?.text);
    }
  }, [videosPost]);

  useEffect(() => {
    dispatch(actions.fetchCategoryPosts(CATEGORY_ID, "videos"));
  }, [dispatch]);

  return (
    <>
      <div className="form-group row" style={{ marginTop: 40 }}>
        <div className="col-lg-6">
          <div style={{ paddingBottom: "5px" }}>
            Upload Smart Advisor Video <span style={{ color: "red" }}>*</span>
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
              accept="video/*"
              ref={inputRef}
            />
            {progress > 0 && <CircularProgressWithLabel value={progress} />}
          </div>
        </div>
        <div className="col-lg-6">
          <div style={{ paddingBottom: "5px" }}>
            Or Write Smart Advisor Video Link{" "}
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

      {(video || link) && (
        <iframe
          className="mb-3"
          ref={videoRef}
          src={parseVideoUrlToIframe(video ? video : link)}
          title="Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          width={300}
          height={169}
        />
      )}

      <div className="form-group row">
        <div
          className="col-lg-2"
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <button
            type="button"
            onClick={handelSubmit}
            className="btn btn-primary btn-elevate"
            disabled={!video && !link}
          >
            Save
          </button>
        </div>
      </div>

      <div className="form-group row" style={{ marginTop: 40 }}>
        <div
          className="col-lg-12"
          style={{ borderBottom: "1px solid #e4e6ef" }}
        ></div>
      </div>
      <StudyTourVideosList />
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
