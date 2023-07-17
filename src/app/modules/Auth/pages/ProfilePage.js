import React, { useState, useEffect } from "react";
import Gravatar from "react-gravatar";
import { useSubheader } from "../../../../_metronic/layout";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import PersonalInfo from "../components/personalInfoComponent";
import AccountInfo from "../components/accountInfoComponent";
import ChangePassword from "../components/changePasswordComponent";

import { Divider } from "@material-ui/core/Divider";

export const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [toggleClass, setToggleClass] = useState(
    "flex-row-auto offcanvas-mobile w-250px w-xxl-350px"
  );

  const toggleAsideMenuInMobile = () => {
    setIsOpen(true);
    console.log("isOpen", isOpen);
    isOpen
      ? setToggleClass(toggleClass + " offcanvas-mobile-on")
      : setToggleClass(toggleClass);
    console.log("toggleClass", toggleClass);
  };

  useEffect(() => {
    if (isOpen) setToggleClass(toggleClass + " offcanvas-mobile-on");
    else setToggleClass("flex-row-auto offcanvas-mobile w-250px w-xxl-350px");
  }, [isOpen]);
  // const suhbeader = useSubheader();
  // suhbeader.setTitle("Prof");

  return (
    // <!--begin::Content-->
    <div
      className="content  d-flex flex-column flex-column-fluid"
      id="kt_content"
    >
      {/* <!--begin::Subheader--> */}
      <div
        className="subheader py-2 py-lg-6  subheader-solid "
        id="kt_subheader"
      >
        <div className=" container-fluid  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
          {/* <!--begin::Info--> */}
          <div className="d-flex align-items-center flex-wrap mr-1">
            {/* <!--begin::Mobile Toggle--> */}
            <button
              className="burger-icon burger-icon-left mr-4 d-inline-block d-lg-none"
              id="kt_subheader_mobile_toggle"
              onClick={() => setIsOpen(true)}
            >
              <span></span>
            </button>
            {/* <!--end::Mobile Toggle--> */}

            {/* <!--begin::Page Heading--> */}
            <div className="d-flex align-items-baseline flex-wrap mr-5">
              {/* <!--begin::Page Title--> */}
              <h5 className="text-dark font-weight-bold my-1 mr-5">Profile</h5>
              {/* <!--end::Page Title--> */}
            </div>
            {/* <!--end::Page Heading--> */}
          </div>
          {/* <!--end::Info--> */}
        </div>
      </div>
      {/* <!--end::Subheader--> */}

      {/* <!--begin::Entry--> */}
      <div className="d-flex flex-column-fluid">
        {/* <!--begin::Container--> */}
        <div className=" container ">
          {/* <!--begin::Profile Personal Information--> */}
          <div className="d-flex flex-row">
            {/* <!--begin::Aside--> */}
            <div className={toggleClass} id="kt_profile_aside">
              {/* <!--begin::Profile Card--> */}
              <div className="card card-custom card-stretch">
                {/* <!--begin::Body--> */}
                <div className="card-body pt-4">
                  {/* <!--begin::User--> */}
                  <div className="d-flex align-items-center">
                    <div className="symbol symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center">
                      <div
                        className="symbol-label"
                        style={{ overflow: "hidden" }}
                      >
                        <Gravatar email={user.email} size={100} />
                      </div>
                      <i className="symbol-badge bg-success"></i>
                    </div>
                    <div>
                      <a
                        href="#"
                        className="font-weight-bolder font-size-h5 text-dark-75 text-hover-primary"
                      >
                        {user.name}
                      </a>
                    </div>
                  </div>
                  {/* <!--end::User--> */}
                  {/* <!--begin::Contact--> */}
                  <div className="py-9">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="font-weight-bold mr-2">Email:</span>
                      <a href="#" className="text-muted text-hover-primary">
                        {user.email}
                      </a>
                    </div>
                    {/* <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="font-weight-bold mr-2">Phone:</span>
                      <span className="text-muted">44(76)34254578</span>
                    </div> */}
                  </div>
                  {/* <!--end::Contact--> */}

                  {/* <!--begin::Nav--> */}
                  <div className="navi navi-bold navi-hover navi-active navi-link-rounded">
                    <div className="navi-item mb-2">
                      <Link to="/user/profile" className="navi-link py-4 ">
                        <span className="navi-icon mr-2">
                          <span className="svg-icon">
                            {/* <!--begin::Svg Icon | path:assets/media/svg/icons/General/User.svg--> */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              width="24px"
                              height="24px"
                              viewBox="0 0 24 24"
                              version="1.1"
                            >
                              <g
                                stroke="none"
                                strokeWidth="1"
                                fill="none"
                                fillRule="evenodd"
                              >
                                <polygon points="0 0 24 0 24 24 0 24" />
                                <path
                                  d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z"
                                  fill="#000000"
                                  fillRule="nonzero"
                                  opacity="0.3"
                                />
                                <path
                                  d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z"
                                  fill="#000000"
                                  fillRule="nonzero"
                                />
                              </g>
                            </svg>
                            {/* <!--end::Svg Icon--> */}
                          </span>
                        </span>
                        <span className="navi-text font-size-lg">
                          Personal Information
                        </span>
                      </Link>
                    </div>

                    <div className="navi-item mb-2">
                      <Link
                        to="/user/profile/change-password"
                        className="navi-link py-4 "
                      >
                        <span className="navi-icon mr-2">
                          <span className="svg-icon">
                            {/* <!--begin::Svg Icon | path:assets/media/svg/icons/Communication/Shield-user.svg--> */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              width="24px"
                              height="24px"
                              viewBox="0 0 24 24"
                              version="1.1"
                            >
                              <g
                                stroke="none"
                                strokeWidth="1"
                                fill="none"
                                fillRule="evenodd"
                              >
                                <rect x="0" y="0" width="24" height="24" />
                                <path
                                  d="M4,4 L11.6314229,2.5691082 C11.8750185,2.52343403 12.1249815,2.52343403 12.3685771,2.5691082 L20,4 L20,13.2830094 C20,16.2173861 18.4883464,18.9447835 16,20.5 L12.5299989,22.6687507 C12.2057287,22.8714196 11.7942713,22.8714196 11.4700011,22.6687507 L8,20.5 C5.51165358,18.9447835 4,16.2173861 4,13.2830094 L4,4 Z"
                                  fill="#000000"
                                  opacity="0.3"
                                />
                                <path
                                  d="M12,11 C10.8954305,11 10,10.1045695 10,9 C10,7.8954305 10.8954305,7 12,7 C13.1045695,7 14,7.8954305 14,9 C14,10.1045695 13.1045695,11 12,11 Z"
                                  fill="#000000"
                                  opacity="0.3"
                                />
                                <path
                                  d="M7.00036205,16.4995035 C7.21569918,13.5165724 9.36772908,12 11.9907452,12 C14.6506758,12 16.8360465,13.4332455 16.9988413,16.5 C17.0053266,16.6221713 16.9988413,17 16.5815,17 C14.5228466,17 11.463736,17 7.4041679,17 C7.26484009,17 6.98863236,16.6619875 7.00036205,16.4995035 Z"
                                  fill="#000000"
                                  opacity="0.3"
                                />
                              </g>
                            </svg>
                            {/* <!--end::Svg Icon--> */}
                          </span>
                        </span>
                        <span className="navi-text font-size-lg">
                          Change Password
                        </span>
                      </Link>
                    </div>
                  </div>
                  {/* <!--end::Nav--> */}
                </div>
                {/* <!--end::Body--> */}
              </div>
              {/* <!--end::Profile Card--> */}
            </div>
            {isOpen ? <div className="offcanvas-mobile-overlay" onClick={() => setIsOpen(false)}></div> : null}
            {/* <!--end::Aside--> */}

            {/* <!--begin::Content--> */}
            <div className="flex-row-fluid ml-lg-8">
              {/* <!--begin::Card--> */}
              <div className="card card-custom card-stretch">
                <Switch>
                  <ContentRoute
                    exact
                    path="/user/profile"
                    component={PersonalInfo}
                  />
                  {/* <ContentRoute path="/user/profile/account-info" component={AccountInfo} /> */}
                  <ContentRoute
                    path="/user/profile/change-password"
                    component={ChangePassword}
                  />
                </Switch>
              </div>
            </div>
            {/* <!--end::Content--> */}
          </div>
          {/* <!--end::Profile Personal Information--> */}
        </div>
        {/* <!--end::Container--> */}
      </div>
      {/* <!--end::Entry--> */}
    </div>
    // <!--end::Content-->
  );
};
