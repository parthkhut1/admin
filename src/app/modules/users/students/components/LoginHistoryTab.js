import React, { useMemo, useEffect, useState } from "react";
import { difference } from "lodash";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/usersActions";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import moment from "moment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import CreditCardIcon from "@material-ui/icons/CreditCard";

import AppleIcon from "@material-ui/icons/Apple";
import AndroidIcon from "@material-ui/icons/Android";
import WebIcon from "@material-ui/icons/Web";

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
  validTag: {
    padding: "5px 5px",
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    fontSize: 15,
  },
  paginationBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  titleText: {
    fontWeight: 600,
    fontSize: 14,
  },
}));

const LoginHistoryTab = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(false);
  const [textFieldInput, setTextFieldInput] = useState("");

  const { history } = useSelector(
    (state) => ({
      history: state.students.history,
    }),
    shallowEqual
  );

  const setDeviceIcon = (name) => {
    // const deviceType = name.split("$:$")[0];
    const deviceType = "web";
    switch (deviceType) {
      case "ios":
        return <AppleIcon style={{ width: 35, height: 35 }} />;
      case "android":
        return <AndroidIcon style={{ width: 35, height: 35 }} />;
      case "web":
        return <WebIcon style={{ width: 35, height: 35 }} />;
      default:
        return <WebIcon style={{ width: 35, height: 35 }} />;
    }
  };

  return (
    <>
      <List className={classes.root}>
        <ListItem alignItems="flex-start" style={{ marginBottom: 30 }}>
          <ListItemText
            primary="The Last 10 User Logging"
            classes={{ primary: classes.titleText }}
          />
        </ListItem>
        {history &&
          history.map((i) => (
            <>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>{setDeviceIcon(i.name)}</ListItemAvatar>
                <ListItemText
                  primary={i.name}
                  classes={{ primary: classes.titleText }}
                  secondary={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: 5,
                      }}
                    >
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {`Sign-in at : ${moment(
                          i.created_at,
                          "YYYY-MM-DD , HH:mm"
                        ).format("YYYY-MM-DD , HH:mm")}`}
                      </Typography>
                    </div>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          ))}
      </List>
    </>
  );
};

export default LoginHistoryTab;
