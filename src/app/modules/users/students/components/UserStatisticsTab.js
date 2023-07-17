import React, { useMemo, useEffect, useState } from "react";
import { difference } from "lodash";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/usersActions";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";


import Chart from "./chart";

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
  titleText:{
    fontWeight: 600,
    fontSize:14,
  },
}));

const UserStatisticsTab = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const { statistics } = useSelector(
    (state) => ({
      statistics: state.students.statistics,
    }),
    shallowEqual
  );

  return (
    <List className={classes.root}>
      {statistics && (
        <>
          <ListItem alignItems="flex-start">
            {/* <ListItemAvatar>
              <ViewQuiltIcon style={{ width: 35, height: 35 }} />
            </ListItemAvatar> */}
            <ListItemText
              primary="Mock Tests"
              classes={{primary: classes.titleText}}

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
                    {`Total count of user mock tests: ${statistics["mock-users"]}`}
                  </Typography>

                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {`Total count of completed user mock tests: ${statistics["finished-mock-users"]}`}
                  </Typography>
                </div>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem alignItems="flex-start">
            {/* <ListItemAvatar>
              <MessageIcon style={{ width: 35, height: 35 }} />
            </ListItemAvatar> */}
            <ListItemText
              primary="Comments"
              classes={{primary: classes.titleText}}
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
                    {`Total count of user comments: ${statistics["comments"]}`}
                  </Typography>
                </div>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <Chart />
        </>
      )}
    </List>
  );
};

export default UserStatisticsTab;
