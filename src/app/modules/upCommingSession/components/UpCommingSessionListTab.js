import React, { useMemo, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../session/_redux/sessionsActions";
import Pagination from "@material-ui/lab/Pagination";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {},
  sessionName: {
    cursor: "pointer",
    "&:hover": {
      color: "#3a9cff"
    }
  },
  inline: {
    display: "inline"
  },
  devider: {
    width: "100%"
  },
  li: {}
}));

const UpCommingSessionListTab = ({}) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [sessions, setSessions] = useState({});

  // sessions Redux state
  const dispatch = useDispatch();
  const { entities, totalPages, user } = useSelector(
    (state) => ({
      entities: state.sessions.entities,
      totalPages: state.sessions.totalPages,
      user: state.auth.user
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(
      actions.fetchSessions({
        pageNumber: page,
        pageSize: 10,
        sortField: "started_at",
        sortOrder: {},
        filter: {},
        isTeacher:
          user &&
          user?.roles?.length != 0 &&
          user?.roles?.findIndex((i) => i === "teacher") != -1
      })
    );
  }, [page]);

  useEffect(() => {
    if (entities)
      setSessions(() => {
        return entities.reduce(function(state, currentValue, index) {
          if (
            !state[
              moment(currentValue.started_at, "YYYY-MM-DD-HH:mm").format(
                "YYYY-MM-DD"
              )
            ]
          ) {
            state[
              moment(currentValue.started_at, "YYYY-MM-DD-HH:mm").format(
                "YYYY-MM-DD"
              )
            ] = [currentValue];
          } else {
            state[
              moment(currentValue.started_at, "YYYY-MM-DD-HH:mm").format(
                "YYYY-MM-DD"
              )
            ].push(currentValue);
          }
          return state;
        }, {});
      });
  }, [entities]);

  return (
    <div style={{ marginTop: 40 }}>
      {sessions &&
        Object.keys(sessions).map((key, index) => (
          <div key={`${key}${index}`} className="form-group row">
            <div
              className="col-lg-12"
              style={{
                backgroundColor: "#f0f0f0",
                borderRadius: 8,
                padding: "10px 0px"
              }}
            >
              <span style={{ fontWeight: 400, marginLeft: 15 }}>
                {moment(key, "ddd, MMM DD").format("ddd, MMM DD")}
              </span>
            </div>
            {sessions[key].map((i) => (
              <div
                key={i.id}
                className="col-lg-12"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 15
                }}
              >
                <div style={{ width: "20%" }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>
                    {`${moment(i.started_at, "YYYY-MM-DD-HH:mm").format(
                      "HH:mm"
                    )} - ${moment(i.started_at, "YYYY-MM-DD-HH:mm")
                      .add(i.duration, "minutes")
                      .format("HH:mm")}`}
                  </span>
                </div>
                <div
                  style={{
                    width: "40%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <span
                    style={{ fontSize: 15, fontWeight: 600 }}
                    className={classes.sessionName}
                    onClick={() => {
                      window.open(i?.holder_data?.start_url);
                    }}
                  >
                    {i.name}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 300 }}>
                    Teacher :
                  </span>

                  <List className={classes.root}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={i.teacher.avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={i.teacher.email}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {i.teacher.name}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider
                      variant="inset"
                      component="li"
                      className={classes.devider}
                    />
                  </List>

                  {/* <span style={{ fontSize: 13, fontWeight: 400 }}>
                    Teacher: {i.teacher.name}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 400 }}>
                    Email: {i.teacher.email}
                  </span> */}
                </div>
              </div>
            ))}
          </div>
        ))}
      <Pagination
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 22
        }}
        count={totalPages}
        onChange={(e, page) => {
          setPage(page);
        }}
      />
    </div>
  );
};
export default UpCommingSessionListTab;
