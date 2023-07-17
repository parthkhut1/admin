/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

export function HeaderMenu({ layoutProps }) {
  const { user } = useSelector(
    (state) => ({
      user: state.auth.user
    }),
    shallowEqual
  );
  const location = useLocation();
  const getMenuItemActive = (url) => {
    return checkIsActive(location, url) ? "menu-item-active" : "";
  };

  return (
    <div
      id="kt_header_menu"
      className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
      {...layoutProps.headerMenuAttributes}
    >
      {/*begin::Header Nav*/}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item menu-item-rel ${getMenuItemActive(
            "/dashboard"
          )}`}
        >
          {user &&
          user?.roles?.length != 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
            <NavLink className="menu-link" to="/dashboard">
              <span className="menu-text">Dashboard</span>
              {layoutProps.rootArrowEnabled && <i className="menu-arrow" />}
            </NavLink>
          ) : null}
        </li>
      </ul>
      {/*end::Header Nav*/}
    </div>
  );
}
