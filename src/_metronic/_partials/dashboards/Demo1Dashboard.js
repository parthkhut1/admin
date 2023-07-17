import React, { useState, useEffect } from "react";
import * as requestFromServer from "./statisticsService";
import { Link } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";



import {
  MixedWidget1,
  MixedWidget14,
  ListsWidget9,
  StatsWidget11,
  StatsWidget12,
  ListsWidget1,
  AdvanceTablesWidget2,
  AdvanceTablesWidget4,
  ListsWidget3,
  ListsWidget4,
  ListsWidget8,
} from "../widgets";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {usersSlice,callTypes} from "../../../app/modules/users/staffs/_redux/usersSlice";
const { actions } = usersSlice;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 400,
  },
  listSection: {
    backgroundColor: "inherit",
  },
  ul: {
    backgroundColor: "inherit",
    paddingLeft: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
  title: {
    flex: "1 1 100%",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(3),
  },
}));
export function Demo1Dashboard() {
  const [statisticType, setStatisticType] = useState("");
  const [statistics, setStatistics] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const dispatch = useDispatch();


  useEffect(() => {
    requestFromServer
      .fetchStatistics()
      .then((response) => {
        const {
          data: { payload: statistics },
        } = response;
        setStatistics(statistics);
      })
      .catch((error) => {
        throw error;
      });

    requestFromServer
      .fetchOnlineUsers()
      .then((response) => {
        const {
          data: { payload: onlineUsers },
        } = response;

        setOnlineUsers(onlineUsers);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  useEffect(() => {
    dispatch(actions.statisticsFetched({ statistics: onlineUsers }));
  }, [onlineUsers]);

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <MixedWidget1
            className="card-stretch gutter-b"
            statisticType={(statistic) => {
              setStatisticType(statistic);
            }}
          />
        </div>

        <div className="col-lg-12 rounded-xl">
          {statisticType && (
            <StatisticsList
              statisticType={statisticType}
              statisticsData={statistics}
              onlineUsers={onlineUsers}
            />
          )}
        </div>

        {/* <div className="col-lg-6 col-xxl-4">
                    <ListsWidget9 className="card-stretch gutter-b"/>
                </div>

                <div className="col-lg-6 col-xxl-4">
                    <StatsWidget11 className="card-stretch card-stretch-half gutter-b"/>
                    <StatsWidget12 className="card-stretch card-stretch-half gutter-b"/>
                </div>

                <div className="col-lg-6 col-xxl-4 order-1 order-xxl-1">
                    <ListsWidget1 className="card-stretch gutter-b"/>
                </div>
                <div className="col-xxl-8 order-2 order-xxl-1">
                    <AdvanceTablesWidget2 className="card-stretch gutter-b"/>
                </div>
                <div className="col-lg-6 col-xxl-4 order-1 order-xxl-2">
                    <ListsWidget3 className="card-stretch gutter-b"/>
                </div>
                <div className="col-lg-6 col-xxl-4 order-1 order-xxl-2">
                    <ListsWidget4 className="card-stretch gutter-b"/>
                </div>
                <div className="col-lg-12 col-xxl-4 order-1 order-xxl-2">
                    <ListsWidget8 className="card-stretch gutter-b"/>
                </div> */}
      </div>
      {/* <div className="row">
                <div className="col-lg-4">
                    <MixedWidget14 className="card-stretch gutter-b" />
                </div>
                <div className="col-lg-8">
                    <AdvanceTablesWidget4 className="card-stretch gutter-b" />
                </div>
            </div> */}
    </>
  );
}

const StatisticsList = ({ statisticType, statisticsData, onlineUsers }) => {
  const [statistics, setStatistics] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    switch (statisticType) {
      case "most-practiced-users":
        setStatistics(statisticsData["most-practiced-users"]?.results);
        break;
      case "most-reported-exam-questions":
        setStatistics(statisticsData["most-reported-exam-questions"]?.results);
        break;
      case "most-reported-difficult-questions":
        setStatistics(
          statisticsData["most-reported-difficult-questions"]?.results
        );
        break;
      case "most-practiced-questions":
        setStatistics(statisticsData["most-practiced-questions"]?.results);
        break;
      case "most-practiced-mock-tests":
        setStatistics(statisticsData["most-practiced-mock-tests"]?.results);
        break;
      case "most-purchased-subscription-types":
        setStatistics(
          statisticsData["most-purchased-subscription-types"]?.results
        );
        break;
      case "most-purchased-packages":
        setStatistics(statisticsData["most-purchased-packages"]?.results);
        break;
    }
  }, [statisticType]);


  return (
    <>
      {statisticType !== "online-users" ? (
        <TableContainer component={Paper}>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {statisticType
              .split("-")
              .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
              .join(" ")}
          </Typography>
          {statistics?.length > 0 ? (
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {statistics[0]
                    ? Object.keys(statistics[0]).map((key) => (
                        <TableCell style={{ color: "red" }}>{key}</TableCell>
                      ))
                    : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {statistics?.map((row) => (
                  <TableRow key={row.id}>
                    {statistics[0]
                      ? Object.keys(row).map((key) => {
                          if (key === "email") {
                            return (
                              <TableCell align="left">
                                <a href={`mailto:${row[key]}`}>{row[key]}</a>
                              </TableCell>
                            );
                          }
                          return <TableCell align="left">{row[key]}</TableCell>;
                        })
                      : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div style={{ marginLeft: 25, marginBottom: 10 }}>
              In processing ...
            </div>
          )}
        </TableContainer>
      ) : (
        <List className={classes.root} subheader={<li />}>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {statisticType
              .split("-")
              .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
              .join(" ")}
          </Typography>
          {Object.keys(onlineUsers).map((key, text) => (
            <li key={`section-${text}`} className={classes.listSection}>
              <ul className={classes.ul}>
                <ListSubheader>{`Online ${key}: ${onlineUsers[key]}`}</ListSubheader>
                {/* <ListItem key={`item-${text}-${key}`}>
                  <ListItemText primary={`${text} ${key} are online.`} />
                </ListItem> */}
              </ul>
            </li>
          ))}
        </List>
      )}
    </>
  );
};
