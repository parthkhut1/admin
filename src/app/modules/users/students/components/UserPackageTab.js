import React, { useMemo, useEffect, useState } from "react";
import { difference } from "lodash";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/usersActions";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

import { Modal, Button } from "react-bootstrap";

import moment from "moment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import ViewQuiltIcon from "@material-ui/icons/ViewQuilt";
import Pagination from "@material-ui/lab/Pagination";
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
}));

const UserPackageTab = ({ setPage }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(false);
  const [textFieldInput, setTextFieldInput] = useState("");

  const { userPackagesList, userPackagesPage, statistics } = useSelector(
    (state) => ({
      userPackagesList: state.students.userPackagesList,
      userPackagesPage: state.students.userPackagesPage,
      statistics: state.students.statistics,
    }),
    shallowEqual
  );

  const goToCouponPage = (couponId) => {
    history.push(`/coupons/${couponId}/edit`);
  };
  return (
    <>
      {userPackagesList && userPackagesList.length != 0 ? (
        <>
          <List className={classes.root}>
            <ListItem alignItems="flex-start" style={{ marginBottom: 30 }}>
              <ListItemAvatar>
                <CreditCardIcon style={{ width: 35, height: 35 }} />
              </ListItemAvatar>
              <ListItemText
                primary="Payments"
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
                      {`Total count of user payments: $ ${statistics &&
                        statistics["total-spent"]}`}
                    </Typography>
                  </div>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            {userPackagesList.map((i) => (
              <>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    {/* <Avatar alt="Remy Sharp" src="" /> */}
                    <ViewQuiltIcon style={{ width: 35, height: 35 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={i.package.name}
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
                      </span> <br/>

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
                    <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                      <button
                        type="button"
                        onClick={() => setShowVerifyModal(true)}
                        className="btn btn-danger btn-elevate btn-sm"
                      >
                        Cancel Package
                      </button>
                    </div>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" component="li" />
                <VerifyPackageCancelationModal
                  userPackage={i}
                  modalShow={showVerifyModal}
                  setModalShow={(v)=>{
                    setShowVerifyModal(v)
                  }}
                />
              </>
            ))}
          </List>
          <Pagination
            className={classes.paginationBox}
            count={userPackagesPage}
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
              <span>Student hasn't any package.</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserPackageTab;

const VerifyPackageCancelationModal = ({
  modalShow = false,
  setModalShow,
  userPackage
}) => {
  const dispatch = useDispatch();
  const handleCancel = () => {
    dispatch(actions.userPackageCancelation(userPackage?.id))
      .then(() => {
        setModalShow(false);
      })
      .catch((e) => {
        setModalShow(false);
      });
  };

  return (
    <>
      <Modal show={modalShow} onHide={() => {setModalShow(false)}}>
        <Modal.Header closeButton>
          <Modal.Title>Package Cancelation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>
            {/* Are you sure to cancel package: {userPackage?.package?.name}? */}
            Are you sure to cancel selected package?
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {setModalShow(false)}}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCancel}>
            Yes,do.
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
