import React, { useMemo, useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SendIcon from "@material-ui/icons/Send";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MessageItem from "./messageItem";
import { Spinner } from "react-bootstrap";
import { format, parseISO } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/ticketsActions";

import { difference, reverse } from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "30px 60px",
  },
  messageContainer: {
    width: "100%",
    maxHeight: 400,
    overflow: "auto",
  },
  loadMoreBox: {
    width: "100%",
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadMoreBtn: {
    backgroundColor: "#2c7bcc",
    borderRadius: 3,
    outline: "none",
    border: "none",
    color: "white",
    height: 30,
  },
  header: {
    height: 100,
    width: "100%",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    zIndex: 12,
  },
  headerContainer: {
    display: "flex",
    justifyContent: "flex-start",
    width: "50%",
    flexDirection: "column",
  },
  messageBox: {
    marginTop: 15,
    width: "100%",
  },
  sendBtn: {
    color: "#3699ff",
    fontSize: 30,
    cursor: "pointer",
  },
  attachBtn: {
    color: "#3699ff",
    fontSize: 28,
    cursor: "pointer",
    marginRight: 15,
  },
  titleBox: {
    marginBottom: 15,
  },
  title: {
    fontSize: 12,
    fontWeight: 300,
    marginRight: 8,
    color: "black",
  },
  titleValue: {
    fontSize: 14,
    fontWeight: 500,
  },
}));

const MessageBox = ({ messages, ticket }) => {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const [editMessage, setEditMessage] = useState(null);
  const [page, setPage] = useState(1);

  //   const messageBody = useRef();

  // tickets Redux state
  const dispatch = useDispatch();
  const { user, actionsLoading, messageTotalCount } = useSelector(
    (state) => ({
      user: state.auth.user,
      actionsLoading: state.tickets.actionsLoading,
      messageTotalCount: state.tickets.messageTotalCount,
    }),
    shallowEqual
  );

  const handleChange = (e) => {
    const { value } = e.target;
    setValue(value);
  };

  const editMessageFunc = (editedMessage = null) => {
    setValue(editedMessage.text);
    setEditMessage(editedMessage);
  };

  const sendMessageFunc = () => {
    if (editMessage) {
      const newMessage = {
        text: value,
      };

      if (!actionsLoading) {
        dispatch(actions.editMessage(editMessage.id, newMessage, ticket.id));
        setValue("");
      }
    } else {
      const message = {
        ticket_id: ticket.id,
        user_id: user.id,
        caption: "cap",
        text: value,
      };

      if (!actionsLoading) {
        dispatch(actions.sendMessage(message));
        setValue("");
      }
    }
  };

  useEffect(() => {
    var messageBody = document.querySelector("#messageBody");
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }, [messages]);

  useEffect(() => {
    console.log("#Page", page);
    if (ticket?.id) dispatch(actions.fetchMessages(ticket?.id, page));
  }, [page]);

  const fetchMoreData = () => {
    if (messageTotalCount >= page) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.header} elevation={0}>
        <div className={classes.headerContainer}>
          <div className={classes.titleBox}>
            <span className={classes.title}>Caption: </span>
            <span className={classes.titleValue}>{ticket?.caption}</span>
          </div>
          <div>
            {ticket?.created_at ? (
              <div className={classes.titleBox}>
                <span className={classes.title}>Created at: </span>
                <span className={classes.titleValue}>
                  {format(new Date(ticket?.created_at), "yyyy-MM-dd HH:mm")}
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
          <div>
            {ticket?.updated_at ? (
              <div className={classes.titleBox}>
                <span className={classes.title}>Updated at: </span>
                <span className={classes.titleValue}>
                  {format(new Date(ticket?.updated_at), "yyyy-MM-dd HH:mm")}
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className={classes.headerContainer}>
          <div className={classes.titleBox}>
            <span className={classes.title}>Category: </span>
            <span className={classes.titleValue}>{ticket?.category}</span>
          </div>
          <div className={classes.titleBox}>
            <span className={classes.title}>Priority: </span>
            <span className={classes.titleValue}>{ticket?.priority}</span>
          </div>
          <div>
            {ticket?.closed_at ? (
              <div>
                <span className={classes.title}>Closed at: </span>
                {`${format(new Date(ticket?.closed_at), "yyyy-MM-dd")}`}
              </div>
            ) : (
              <span className={classes.titleValue}>Not Closed</span>
            )}
          </div>
        </div>
      </Paper>
      <Paper id="messageBody" className={classes.messageContainer}>
        <div className={classes.loadMoreBox}>
          <button
            onClick={fetchMoreData}
            type="button"
            className={classes.loadMoreBtn}
            disabled={messageTotalCount <= page}
          >
            {messageTotalCount > page
              ? "Click to load more"
              : "No more message"}
          </button>
        </div>
        <div>
          {messages &&
            reverse([...messages])?.map((m) => (
              <MessageItem
                key={`${m.id}${m.created_at}`}
                message={m}
                ticketId={ticket.id}
                editedMessage={(message) => editMessageFunc(message)}
              />
            ))}
        </div>
      </Paper>
      <TextField
        className={classes.messageBox}
        id="outlined-multiline-flexible"
        label="Write message"
        placeholder="Write message"
        multiline
        rowsMax={15}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {/* <AttachFileIcon className={classes.attachBtn} /> */}
              <div onClick={sendMessageFunc}>
                <SendIcon className={classes.sendBtn} />
              </div>
            </InputAdornment>
          ),
        }}
        value={value}
        onChange={handleChange}
        variant="outlined"
      />
    </div>
  );
};

export default MessageBox;
