import React, { useEffect, useState, useRef } from "react";
import { Field } from "formik";
import { Input } from "../../../../_metronic/_partials/controls";
import { useDispatch } from "react-redux";
import * as actions from "../_redux/categoriesActions";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";
import axios from "axios";
import Upload from "./Upload";
import { parseVideoUrlToIframe } from "../../../utility";

const PostVideo = ({ post = {}, onDelete, onUpdate }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const inputFileRef = useRef(null);
  const videoRef = useRef(null);
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState("");
  const [link, setLink] = useState("");
  const [progress, setProgress] = useState(0);

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

      enqueueSnackbar(
        "Upload was successfully, please click on Update Button.",
        { variant: "success" }
      );
      setVideo(response.data.payload.url);
      setLink("");
      return response.data.payload.url;
    } catch (error) {
      setProgress(0);
      setVideo("");
      inputFileRef.current.value = "";
      //   document.getElementById("files-upload").value = null;
      return enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const handelUpdate = () => {
    const newPost = {
      id: post.id,
      title,
      text: video ? video : link,
      is_featured: 0,
    };
    dispatch(actions.updatePost(newPost));
    onUpdate(newPost);
  };
  const handelDelete = () => {
    dispatch(actions.deletePost(post.id));
    onDelete(post.id);
  };

  useEffect(() => {
    if (post) {
      const { title, text } = post;
      setTitle(title);
      setVideo(text);
    }
  }, [post]);

  return (
    <div
      style={{
        width: "100%",
        marginTop: 40,
        border: "1px solid #e4e6ef",
        padding: 10,
        borderRadius: 5,
      }}
    >
      <input
        type="file"
        ref={inputFileRef}
        onChange={handleChangeStatus}
        style={{ display: "none" }}
      />
      <Box className="mb-3" position="relative" width="100%" height={116}>
        <iframe
          ref={videoRef}
          src={parseVideoUrlToIframe(video ? video : link)}
          title="Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%" }}>
          <Field
            name="title"
            disableValidation={true}
            component={Input}
            hideEnterTitle={true}
            disabled={!post.id}
            placeholder="Video Title"
            onChange={(e) => {
              const { value } = e.target;
              setTitle(value);
            }}
            value={title}
          />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <div
            style={{
              border: "1px solid #e4e6ef",
              borderRadius: "0.42rem",
              marginRight: 3,
              cursor: "pointer",
            }}
            onClick={() => {
              if (post.id) inputFileRef.current.click();
            }}
          >
            {progress > 0 ? (
              <CircularProgressWithLabel value={progress} />
            ) : (
              <Upload width={35} height={35} color="#3699ff" />
            )}
          </div>
          <Field
            name="title"
            disableValidation={true}
            component={Input}
            hideEnterTitle={true}
            disabled={!post.id}
            placeholder="Or Write Video Link"
            onChange={(e) => {
              const { value } = e.target;
              setLink(value);
              setVideo(value);
            }}
            value={link}
          />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <button
            style={{ marginTop: 5, width: "45%" }}
            type="button"
            onClick={handelUpdate}
            className="btn btn-primary btn-elevate"
            disabled={!post.id}
          >
            Update
          </button>
          <button
            style={{ marginTop: 5, width: "45%" }}
            type="button"
            onClick={handelDelete}
            className="btn btn-danger btn-elevate"
            disabled={!post.id}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostVideo;

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
