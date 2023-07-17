import React, { useMemo, useEffect, useState } from "react";
import { difference } from "lodash";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/packagesActions";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

import moment from "moment";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Gravatar from "react-gravatar";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import ViewQuiltIcon from "@material-ui/icons/ViewQuilt";
import Pagination from "@material-ui/lab/Pagination";
import CircularProgress from "@material-ui/core/CircularProgress";
import CreditCardIcon from "@material-ui/icons/CreditCard";

import CommentIcon from "@material-ui/icons/Comment";
import Collapse from "@material-ui/core/Collapse";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";

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
  userName: {
    fontSize: "1.1em",
    fontWeight: 700,
  },
  userEmail: {
    fontSize: "0.9em",
    fontWeight: 500,
    color: "#95a5a6",
    marginLeft: 6,
  },
  exportBtn: {
    marginTop: 30,
    backgroundColor: "#57a4ff",
    padding: "10px 30px",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#57a4ff",
    },
    "&$selected": {
      backgroundColor: "#57a4ff",
    },
    "&$disabled": {
      color: "#fff",
      backgroundColor: "#bdc3c7",
    },
  },
  disabled: {},
  exportBtnLabel: {},
  spinnerClass: {
    color: "#fff",
    margin: "0px 5px",
  },
}));

const UserPackageTab = ({ packageId, setPage }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(false);
  const [textFieldInput, setTextFieldInput] = useState("");

  const {
    usersPackagesList,
    usersPackagesPage,
    statistics,
    actionsLoading,
  } = useSelector(
    (state) => ({
      usersPackagesList: state.packages.usersPackagesList,
      usersPackagesPage: state.packages.usersPackagesPage,
      statistics: state.packages.statistics,
      actionsLoading: state.packages.actionsLoading,
    }),
    shallowEqual
  );

  const goToCouponPage = (couponId) => {
    history.push(`/coupons/${couponId}/edit`);
  };
  return (
    <>
      <Grid container justify="flex-end" alignItems="center">
        <Button
          variant="primary"
          classes={{
            root: classes.exportBtn,
            label: classes.exportBtnLabel,
            disabled: classes.disabled,
          }}
          disabled={usersPackagesList.length == 0}
          onClick={() => {
            if (packageId) dispatch(actions.fetchExportList(packageId));
          }}
        >
          Export List{" "}
          {actionsLoading && (
            <CircularProgress
              size={20}
              classes={{ colorPrimary: classes.spinnerClass }}
            />
          )}
        </Button>
      </Grid>
      {usersPackagesList && usersPackagesList.length != 0 ? (
        <>
          <List className={classes.root}>
            {usersPackagesList.map((i) => (
              <>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={i?.user?.avatar} />
                    {/* <Gravatar email={i?.user?.avatar} size={100} /> */}
                  </ListItemAvatar>
                  <ListItemText
                    // primary={i.user.name}
                    primary={
                      <Grid container alignItems="center">
                        <Typography
                          variant="subtitle1"
                          className={classes.userName}
                        >
                          {i.user.name}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          className={classes.userEmail}
                        >
                          ({i.user.email})
                        </Typography>
                      </Grid>
                    }
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
                          {`Package name: ${i?.package?.name}`}
                        </Typography>

                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {`Payment method: ${
                            i.payment.gateway === "nil"
                              ? "Assigned by admin"
                              : i.payment.gateway
                          }`}
                        </Typography>

                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {`Package Price: $ ${i.package.price}`}
                        </Typography>

                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {`Paid Price: $ ${
                            i.payment.gateway === "nil"
                              ? 0
                              : i.payment.discounted_price
                          }`}
                        </Typography>
                        <div>
                          {i.payment.coupon_id ? (
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                              >
                                {`Coupon:`}
                              </Typography>
                              <span
                                onClick={() =>
                                  goToCouponPage(i.payment.coupon_id)
                                }
                                style={{
                                  cursor: "pointer",
                                  color: "#399cff",
                                  fontSize: 12,
                                  marginLeft: 5,
                                }}
                              >
                                See coupon detail
                              </span>
                            </>
                          ) : (
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {`Coupon: -`}
                            </Typography>
                          )}
                        </div>

                        {typeof i?.counters === "object" &&
                          i?.counters !== null &&
                          Object.keys(i.counters).map((key) => (
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {key}: {i.counters[key]?.left}/
                              {i.counters[key]?.limit}
                            </Typography>
                          ))}
                      </div>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      className={classes.validTag}
                      aria-label="comments"
                      disabled={true}
                    >
                      <span style={{ color: "#bebebe", fontSize: 13 }}>
                        started at:
                      </span>
                      <span
                        style={{
                          color: `${i.is_fully_used ? "red" : "#3699ff"}`,
                          margin: "5px 5px",
                          fontSize: 14,
                        }}
                      >
                        {moment(i.expired_at, "YYYY-MM-DD")
                          .add(-i.package.duration, "days")
                          .format("YYYY-MM-DD")}
                      </span>{" "}
                      <br />
                      <span style={{ color: "#bebebe", fontSize: 13 }}>
                        expired at:
                      </span>
                      <span
                        style={{
                          color: `${i.is_fully_used ? "red" : "#3699ff"}`,
                          margin: "5px 5px",
                          fontSize: 14,
                        }}
                      >
                        {moment(i.expired_at, "YYYY-MM-DD").format(
                          "YYYY-MM-DD"
                        )}
                      </span>
                    </IconButton>
                    {/* <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <button
                        type="button"
                        onClick={() => setShowVerifyModal(true)}
                        className="btn btn-danger btn-elevate btn-sm"
                      >
                        Cancel Package
                      </button>
                    </div> */}
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" component="li" />
                {/* <VerifyPackageCancelationModal
                  userPackage={i}
                  modalShow={showVerifyModal}
                  setModalShow={(v) => {
                    setShowVerifyModal(v);
                  }}
                /> */}
              </>
            ))}
          </List>
          {/* <Pagination
            className={classes.paginationBox}
            count={usersPackagesPage}
            onChange={(e, page) => {
              setPage(page);
            }}
          /> */}
        </>
      ) : (
        <>
          <div className="form-group row" style={{ marginTop: 40 }}>
            <div
              className="col-lg-12"
              style={{ textAlign: "center", fontSize: 15 }}
            >
              <span>Package hasn't any subscribs.</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserPackageTab;

// const VerifyPackageCancelationModal = ({
//   modalShow = false,
//   setModalShow,
//   userPackage,
// }) => {
//   const dispatch = useDispatch();
//   const handleCancel = () => {
//     dispatch(actions.userPackageCancelation(userPackage?.id))
//       .then(() => {
//         setModalShow(false);
//       })
//       .catch((e) => {
//         setModalShow(false);
//       });
//   };

//   return (
//     <>
//       <Modal
//         show={modalShow}
//         onHide={() => {
//           setModalShow(false);
//         }}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Package Cancelation</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <span>
//             {/* Are you sure to cancel package: {userPackage?.package?.name}? */}
//             Are you sure to cancel selected package?
//           </span>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => {
//               setModalShow(false);
//             }}
//           >
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleCancel}>
//             Yes,do.
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };
