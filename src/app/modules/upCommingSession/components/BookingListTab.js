import React, { useMemo, useEffect, useState } from "react";
import { difference } from "lodash";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/sessionsActions";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
import Collapse from "@material-ui/core/Collapse";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  textField: {
    width: "88%",
    marginLeft: "8%",
  },
  sendBtn: {
    color: "#3699ff",
  },
  paginationBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
}));

const BookingListTab = ({ setPage }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState();
  const [textFieldInput, setTextFieldInput] = useState("");

  const { sessionBookingList, sessionBookingTotalPage } = useSelector(
    (state) => ({
      sessionBookingList: state.sessions.sessionBookingList,
      sessionBookingTotalPage: state.sessions.sessionBookingTotalPage,
    }),
    shallowEqual
  );

  return (
    <>
      {sessionBookingList && sessionBookingList.length != 0 ? (
        <>
          <List className={classes.root}>
            {sessionBookingList.map((i) => (
              <>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={i.user.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={i.user.email}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {i.user.name}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => {
                        setId(i.id);
                        setOpen(!open);
                      }}
                    >
                      <CommentIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={open && id == i.id} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem button className={classes.nested}>
                      <TextField
                        className={classes.textField}
                        id="outlined-multiline-static"
                        label="Write message ..."
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="For more options, please goto Ticket menu."
                        onChange={(e) => {
                          const { value } = e.target;
                          setTextFieldInput(value);
                        }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          className={classes.sendBtn}
                          aria-label="comments"
                          onClick={() => {
                            const message = {
                              category_id: 7,
                              priority_id: 2,
                              caption: "session message",
                              user_id: i.user.id,
                              message: {
                                text: "session message",
                              },
                              text: textFieldInput,
                            };
                            dispatch(actions.sendMessage(message));
                            setTextFieldInput("");
                          }}
                        >
                          <SendIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Collapse>
                <Divider variant="inset" component="li" />
              </>
            ))}
          </List>
          <Pagination
            className={classes.paginationBox}
            count={sessionBookingTotalPage}
            onChange={(e, page) => {
              setPage(page);
            }}
          />
        </>
      ) : (
        <>
          <div className="form-group row" style={{ marginTop: 40 }}>
            <div
              className="col-lg-12"
              style={{ textAlign: "center", fontSize: 15 }}
            >
              <span>Nobody booked this session.</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BookingListTab;
