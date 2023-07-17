import React, { useMemo, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import * as actions from "../_redux/ticketsActions";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";

const useStyles = makeStyles((theme) => ({
  root: {},

  messageContainerRight: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: "50%",
  },
  messageContainerLeft: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: "50%",
  },
  messageBoxRight: {
    width: "100%",
    minHeight: 80,
    background: "#fff4c5",
    position: "relative",
    margin: "25px 0",
    padding: 15,
    borderRadius: 10,
    ":&before": {
      content: '""',
      position: "absolute",
      right: "100%",
      top: 26,
      width: 0,
      height: 0,
      borderTop: "13px solid transparent",
      borderRight: "26px solid #f1f1f1",
      borderBottom: "13px solid transparent",
    },
  },
  messageBoxLeft: {
    width: "100%",
    minHeight: 80,
    background: "#e3f6ff",
    position: "relative",
    margin: "25px 0",
    padding: 15,
    borderRadius: 10,
    ":&before": {
      content: '""',
      position: "absolute",
      right: "100%",
      top: 26,
      width: 0,
      height: 0,
      borderTop: "13px solid transparent",
      borderRight: "26px solid #f1f1f1",
      borderBottom: "13px solid transparent",
    },
  },
  rightFlesh: {
    width: 0,
    height: 0,
    borderTop: "10px solid transparent",
    borderLeft: "30px solid #fff4c5",
    borderBottom: "10px solid transparent",
  },
  leftFlesh: {
    width: 0,
    height: 0,
    borderTop: "10px solid transparent",
    borderRight: "30px solid #e3f6ff",
    borderBottom: "10px solid transparent",
  },
  messageBoxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    // borderBottom: "1px solid gray",
    marginBottom: 10,
    paddingBottom: 15,
  },
  messageBoxImage: {
    width: 45,
    height: 45,
    borderRadius: "50%",
    border: "#f9f9f9",
    overflow: "hidden",
    marginRight: 5,
  },
  userNameText: {
    fontSize: 15,
    fontWeight: 600,
  },
  dateInHeader: {
    fontSize: 12,
  },
  messageBoxContent: {
    lineHeight: 1.8,
    fontSize: 14,
  },
  messageBoxCaption: {
    fontWeight: 500,
    fontSize: 14,
    marginBottom: 10,
  },
  messageBoxFooter: {
    // borderTop: "1px solid gray",
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  icons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    cursor: "pointer",
    color: "#3699ff",
    marginLeft: 10,
  },
  deleteBtn: {
    cursor: "pointer",
    color: "#f64e60",
    marginLeft: 10,
  },
}));

const MessageItem = ({ message, ticketId, editedMessage }) => {
  const classes = useStyles();

  // tickets Redux state
  const dispatch = useDispatch();
  const { messages, user } = useSelector(
    (state) => ({
      user: state.auth.user,
    }),
    shallowEqual
  );

  const deleteMessage = (messageId) => {
    dispatch(actions.deleteMessage(ticketId, messageId));
  };
  return (
    <div className={classes.root}>
      {user.id === message.user.id ? (
        <div className={classes.messageContainerLeft}>
          <div className={classes.leftFlesh}></div>
          <div className={classes.messageBoxLeft}>
            <div className={classes.messageBoxHeader}>
              <div className={classes.messageBoxImage}>
                <img
                  src={
                    message.user.avatar
                      ? message.user.avatar
                      : toAbsoluteUrl("/media/users/default.jpg")
                  }
                  width={45}
                  height={45}
                ></img>
              </div>
              <div>
                <div className={classes.userNameText}>{message?.user.name}</div>
                <div className={classes.dateInHeader}>
                  {`${format(new Date(message.created_at), "yyyy-MM-dd")}`}
                  <span style={{ margin: "0 5px" }}></span>
                  {`${format(new Date(message.created_at), "HH:mm")}`}
                </div>
              </div>
            </div>
            <div className={classes.messageBoxContent}>
              {/* <div>{`Caption: ${message.caption}`}</div> */}
              <div>{message.text}</div>
            </div>
            <div className={classes.messageBoxFooter}>
              <div>
                {message.created_at === message.updated_at ? (
                  ""
                ) : (
                  <span style={{ fontSize: 12, color: "gray" }}>edited</span>
                )}
              </div>

              <div className={classes.icons}>
                <div
                  className={classes.editBtn}
                  onClick={() => editedMessage(message)}
                >
                  <EditIcon />
                </div>
                <div
                  className={classes.deleteBtn}
                  onClick={() => deleteMessage(message.id)}
                >
                  <DeleteIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={classes.messageContainerRight}>
          <div className={classes.messageBoxRight}>
            <div className={classes.messageBoxHeader}>
              <div className={classes.messageBoxImage}>
                <img
                  src={
                    message.user.avatar
                      ? message.user.avatar
                      : toAbsoluteUrl("/media/users/default.jpg")
                  }
                  width={45}
                  height={45}
                ></img>
              </div>
              <div>
                <div className={classes.userNameText}>{message?.user.name}</div>
                <div className={classes.dateInHeader}>
                  {`${format(new Date(message.created_at), "yyyy-MM-dd")}`}{" "}
                  <span style={{ margin: "0 5px" }}></span>
                  {`${format(new Date(message.created_at), "HH:mm")}`}
                </div>
              </div>
            </div>
            <div className={classes.messageBoxContent}>
              <div className={classes.messageBoxCaption}>
                <span style={{ fontSize: 13, fontWeight: 400 }}>Caption: </span>
                {message.caption}
              </div>
              <div>{message.text}</div>
            </div>
            <div className={classes.messageBoxFooter}>
              <div>
                {message.created_at === message.updated_at ? (
                  ""
                ) : (
                  <span style={{ fontSize: 12, color: "gray" }}>edited</span>
                )}
              </div>{" "}
              <div className={classes.icons}>
                <div
                  className={classes.editBtn}
                  onClick={() => editedMessage(message)}
                >
                  <EditIcon />
                </div>
                <div
                  className={classes.deleteBtn}
                  onClick={() => deleteMessage(message.id)}
                >
                  <DeleteIcon />
                </div>
              </div>
            </div>
          </div>
          <div className={classes.rightFlesh}></div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
