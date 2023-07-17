/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,no-undef */
import React, { useEffect, useState } from 'react';
import Gravatar from 'react-gravatar';
import SVG from 'react-inlinesvg';

import { useHistory } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../../_helpers';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as actions from './../../../../../app/modules/Notification/notificationsActions';

export function QuickUser() {
  const { user } = useSelector((state) => state.auth);
  const [showAllNotif, setShowAllNotif] = useState(false);

  const history = useHistory();

  const logoutClick = () => {
    const toggle = document.getElementById('kt_quick_user_toggle');
    if (toggle) {
      toggle.click();
    }
    history.push('/logout');
  };

  // questions Redux state
  const dispatch = useDispatch();
  const { entities, unreadEntities } = useSelector(
    (state) => ({
      entities: state.notifications.entities,
      unreadEntities: state.notifications.unreadEntities,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (user && user?.roles?.length != 0 && user?.roles?.findIndex((i) => i === 'teacher') != -1) {
      return;
    }
    // server call for getting all read and unread notifications
    if (showAllNotif) dispatch(actions.fetchAllNotifications());
    else dispatch(actions.fetchUnreadNotifications());
  }, [showAllNotif, dispatch]);

  return (
    <div id="kt_quick_user" className="offcanvas offcanvas-right offcanvas p-10">
      <div className="offcanvas-header d-flex align-items-center justify-content-between pb-5">
        <h3 className="font-weight-bold m-0">
          User Profile **
          {/* <small className="text-muted font-size-sm ml-2">12 messages</small> */}
        </h3>
        <a
          href="#"
          className="btn btn-xs btn-icon btn-light btn-hover-primary"
          id="kt_quick_user_close"
        >
          <i className="ki ki-close icon-xs text-muted" />
        </a>
      </div>

      <div className="offcanvas-content pr-5 mr-n5">
        <div className="d-flex align-items-center mt-5">
          <div className="symbol symbol-100 mr-5">
            <div className="symbol-label" style={{ overflow: 'hidden' }}>
              <Gravatar email={user.email} size={100} />
            </div>
            <i className="symbol-badge bg-success" />
          </div>
          <div className="d-flex flex-column">
            <a href="#" className="font-weight-bold font-size-h5 text-dark-75 text-hover-primary">
              {user.name}
            </a>
            {/* <div className="text-muted mt-1">Application Developer</div> */}
            <div className="navi mt-2">
              <a href="#" className="navi-item">
                <span className="navi-link p-0 pb-2">
                  <span className="navi-icon mr-1">
                    <span className="svg-icon-lg svg-icon-primary">
                      <SVG
                        src={toAbsoluteUrl('/media/svg/icons/Communication/Mail-notification.svg')}
                      ></SVG>
                    </span>
                  </span>
                  <span className="navi-text text-muted text-hover-primary">{user.email}</span>
                </span>
              </a>
            </div>
            {/* <Link to="/logout" className="btn btn-light-primary btn-bold">
                Sign Out
              </Link> */}
            <button className="btn btn-light-primary btn-bold" onClick={logoutClick}>
              Sign out
            </button>
          </div>
        </div>

        <div className="separator separator-dashed mt-8 mb-5" />

        <div className="navi navi-spacer-x-0 p-0">
          <a href="/user/profile" className="navi-item">
            <div className="navi-link">
              <div className="symbol symbol-40 bg-light mr-3">
                <div className="symbol-label">
                  <span className="svg-icon svg-icon-md svg-icon-success">
                    <SVG src={toAbsoluteUrl('/media/svg/icons/General/Notification2.svg')}></SVG>
                  </span>
                </div>
              </div>
              <div className="navi-text">
                <div className="font-weight-bold">My Profile</div>
                <div className="text-muted">
                  Account settings{' '}
                  {/* <span className="label label-light-danger label-inline font-weight-bold">
                    update
                  </span> */}
                </div>
              </div>
            </div>
          </a>
        </div>
        <div
          className="navi navi-spacer-x-0 p-0"
          onClick={() => {
            setShowAllNotif((showAllNotif) => !showAllNotif);
          }}
        >
          <a href="#" className="navi-item">
            <div className="navi-link">
              <div className="symbol symbol-40 bg-light mr-3">
                <div className="symbol-label">
                  <span className="svg-icon svg-icon-md svg-icon-success">
                    <SVG src={toAbsoluteUrl('/media/svg/icons/General/Notifications1.svg')}></SVG>
                  </span>
                </div>
              </div>
              <div className="navi-text">
                <div className="font-weight-bold">
                  {showAllNotif ? 'Unread Notifications' : 'All Notifications'}
                </div>
                <div className="text-muted">
                  notifications{' '}
                  {/* <span className="label label-light-danger label-inline font-weight-bold">
                    update
                  </span> */}
                </div>
              </div>
            </div>
          </a>
        </div>

        <div className="separator separator-dashed my-7"></div>

        {showAllNotif ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <h5 className="">All Notifications</h5>
              {unreadEntities?.length != 0 ? (
                <button
                  style={{
                    backgroundColor: '#e1f0ff',
                    color: '#48a2ff',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '10px',
                  }}
                  onClick={() => dispatch(actions.updateNotificationsState())}
                >
                  Mark all as read
                </button>
              ) : null}
            </div>

            {/* {readNotifFakeData?.map((notif) => ( */}
            {entities?.map((notif) => (
              <div
                className={`d-flex align-items-center rounded p-5 gutter-b`}
                style={
                  !notif.read_at
                    ? {
                        backgroundColor: setNotificationCategories(notif.type).backgroundColor,
                      }
                    : { backgroundColor: 'rgb(230 230 230 / 69%)' }
                }
              >
                <span
                  className={`svg-icon ${
                    !notif.read_at ? setNotificationCategories(notif.type).iconType : ''
                  } mr-5`}
                  style={{
                    color: setNotificationCategories(notif.type).color,
                  }}
                >
                  <SVG
                    src={toAbsoluteUrl('/media/svg/icons/Home/Library.svg')}
                    className="svg-icon svg-icon-lg"
                  ></SVG>
                </span>

                <div className="d-flex flex-column flex-grow-1 mr-2">
                  <a
                    href="#"
                    className="font-weight-normal text-dark-75 font-size-lg mb-1"
                    style={{ cursor: 'default' }}
                  >
                    {notif.data.message}
                  </a>
                  <span className="text-muted font-size-sm">
                    {notif.type}| {notif.data.mock_id}
                  </span>
                </div>

                <span
                  className="font-weight-bolder text-hover-primary  py-1 font-size-lg"
                  style={{
                    color: setNotificationCategories(notif.type).color,
                    cursor: setNotificationCategories(notif.type).cursor,
                  }}
                  onClick={() => {
                    dispatch(actions.updateNotificationState(notif.id));
                  }}
                >
                  {notif.read_at ? '' : 'Read'}
                </span>
              </div>
            ))}
          </>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <h5 className="">Unread Notifications</h5>
              {unreadEntities?.length != 0 ? (
                <button
                  style={{
                    backgroundColor: '#e1f0ff',
                    color: '#48a2ff',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '10px',
                  }}
                  onClick={() => dispatch(actions.updateNotificationsState())}
                >
                  Mark all as read
                </button>
              ) : null}
            </div>

            {/* {unreadNotifFakeData?.map((notif) => ( */}
            {unreadEntities?.map((notif) => (
              <div
                key={notif.id}
                className={`d-flex align-items-center rounded p-5 gutter-b`}
                style={{
                  backgroundColor: setNotificationCategories(notif.type).backgroundColor,
                }}
              >
                <span
                  className={`svg-icon ${setNotificationCategories(notif.type).iconType} mr-5`}
                  style={{
                    color: setNotificationCategories(notif.type).color,
                  }}
                >
                  <SVG
                    src={toAbsoluteUrl('/media/svg/icons/Home/Library.svg')}
                    className="svg-icon svg-icon-lg"
                  ></SVG>
                </span>

                <div className="d-flex flex-column flex-grow-1 mr-2">
                  <a
                    href="#"
                    className="font-weight-normal text-dark-75 font-size-lg mb-1"
                    style={{ cursor: 'default' }}
                  >
                    {notif.data.message}
                  </a>
                  <span className="text-muted font-size-sm">
                    {notif.type}| {notif.data.mock_id}
                  </span>
                </div>

                <span
                  className="font-weight-bolder text-hover-primary py-1 font-size-lg"
                  style={{
                    color: setNotificationCategories(notif.type).color,
                    cursor: setNotificationCategories(notif.type).cursor,
                  }}
                  onClick={() => {
                    dispatch(actions.updateNotificationState(notif.id));
                  }}
                >
                  Read
                </span>
              </div>
            ))}
          </>
        )}
        <div></div>
      </div>
    </div>
  );
}

const setNotificationCategories = (category) => {
  if (category === 'new-user-registered') {
    return {
      backgroundColor: '#C9F7F5',
      color: '#1BC5BD',
      cursor: 'pointer',
      iconType: 'svg-icon-success',
    };
  } else if (category === 'mock-user-completed') {
    return {
      backgroundColor: '#FFF4DE',
      color: '#FFA800',
      cursor: 'pointer',
      iconType: 'svg-icon-warning',
    };
  } else if (category === 'new-ticket-message') {
    return {
      backgroundColor: 'rgb(0 255 180 / 71%)',
      color: '#1BC5BD',
      cursor: 'pointer',
      iconType: 'svg-icon-success',
    };
  } else if (
    category === 'package-paid' ||
    category === 'payment-created' ||
    category === 'payment-successfully-paid' ||
    category === 'subscription-expiration-reminder' ||
    category === 'subscription-paid'
  ) {
    return {
      backgroundColor: '#FFE2E5',
      color: 'rgb(246, 78, 96)',
      cursor: 'pointer',
      iconType: 'svg-icon-danger',
    };
  } else if (
    category === 'session-booking-paid' ||
    category === 'session-booking-reminder' ||
    category === 'session-created' ||
    category === 'session-reminder'
  ) {
    return {
      backgroundColor: '#EEE5FF',
      color: '#8950FC',
      cursor: 'pointer',
      iconType: 'svg-icon-info',
    };
  }
};

// Other notification sample like : bg-light-success | bg-light-danger | bg-light-info

{
  /* <div className="d-flex align-items-center bg-light-success rounded p-5 gutter-b">
<span className="svg-icon svg-icon-success mr-5">
  <SVG
    src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
    className="svg-icon svg-icon-lg"
  ></SVG>
</span>
<div className="d-flex flex-column flex-grow-1 mr-2">
  <a
    href="#"
    className="font-weight-normal text-dark-75 text-hover-primary font-size-lg mb-1"
  >
    Would be to people
  </a>
  <span className="text-muted font-size-sm">Due in 2 Days</span>
</div>

<span className="font-weight-bolder text-success py-1 font-size-lg">
  +50%
</span>
</div>

<div className="d-flex align-items-center bg-light-danger rounded p-5 gutter-b">
<span className="svg-icon svg-icon-danger mr-5">
  <SVG
    src={toAbsoluteUrl(
      "/media/svg/icons/Communication/Group-chat.svg"
    )}
    className="svg-icon svg-icon-lg"
  ></SVG>
</span>
<div className="d-flex flex-column flex-grow-1 mr-2">
  <a
    href="#"
    className="font-weight-normel text-dark-75 text-hover-primary font-size-lg mb-1"
  >
    Purpose would be to persuade
  </a>
  <span className="text-muted font-size-sm">Due in 2 Days</span>
</div>

<span className="font-weight-bolder text-danger py-1 font-size-lg">
  -27%
</span>
</div>

<div className="d-flex align-items-center bg-light-info rounded p-5">
<span className="svg-icon svg-icon-info mr-5">
  <SVG
    src={toAbsoluteUrl("/media/svg/icons/General/Attachment2.svg")}
    className="svg-icon svg-icon-lg"
  ></SVG>
</span>

<div className="d-flex flex-column flex-grow-1 mr-2">
  <a
    href="#"
    className="font-weight-normel text-dark-75 text-hover-primary font-size-lg mb-1"
  >
    The best product
  </a>
  <span className="text-muted font-size-sm">Due in 2 Days</span>
</div>

<span className="font-weight-bolder text-info py-1 font-size-lg">
  +8%
</span>
</div> */
}
