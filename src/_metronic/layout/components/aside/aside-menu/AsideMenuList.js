/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  const [hover, setHover] = useState(false);
  const [hoverdStyle, setHoverdStyle] = useState(null);

  const { user } = useSelector(
    (state) => ({
      user: state.auth.user
    }),
    shallowEqual
  );

  useEffect(() => {
    if (hover) {
      setHoverdStyle({ backgroundColor: "red" });
    } else {
      setHoverdStyle({ backgroundColor: "blue" });
    }
  }, [hover]);

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/dashboard">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                  />
                </span>
                <span className="menu-text">Dashboard</span>
              </NavLink>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                "staffs"
              )} ${getMenuItemActive("students")} ${getMenuItemActive(
                "trashed"
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              <NavLink className="menu-link menu-toggle" to="/users">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")}
                  />
                </span>
                <span className="menu-text">Users</span>
                <i className="menu-arrow" />
              </NavLink>
              <div className="menu-submenu">
                <i className="menu-arrow" />

                <ul className="menu-subnav">
                  <li
                    className="menu-item menu-item-parent"
                    aria-haspopup="true"
                  >
                    <span className="menu-link">
                      <span className="menu-text">Users</span>
                    </span>
                  </li>
                  {/* begin::2 Level */}
                  {/* begin::3 Level */}
                  <li
                    className={`menu-item ${getMenuItemActive("/staffs")}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/staffs">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Staffs</span>
                    </NavLink>
                  </li>
                  {/* end::3 Level */}
                  {/* end::2 Level */}
                  {/* begin::2 Level */}
                  {/* begin::3 Level */}
                  <li
                    className={`menu-item ${getMenuItemActive("/students")}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/students">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Students</span>
                    </NavLink>
                  </li>
                  {/* end::3 Level */}
                  {/* end::2 Level */}
                  {/* begin::2 Level */}
                  {/* begin::3 Level */}
                  <li
                    className={`menu-item ${getMenuItemActive("/trashed")}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/trashed">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Trashed</span>
                    </NavLink>
                  </li>
                  {/* end::3 Level */}
                  {/* end::2 Level */}
                </ul>
              </div>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item ${getMenuItemActive(
                "/payment-logs",
                false
              )}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/payment-logs">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")}
                  />
                </span>
                <span className="menu-text">Payment logs</span>
              </NavLink>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item ${getMenuItemActive("/coupons", false)}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/coupons">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")}
                  />
                </span>
                <span className="menu-text">Coupons</span>
              </NavLink>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item menu-item-submenu`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              <NavLink className="menu-link menu-toggle" to="/tests">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")}
                  />
                </span>
                <span className="menu-text">Tests</span>
                <i className="menu-arrow" />
              </NavLink>
              <div className="menu-submenu">
                <i className="menu-arrow" />
                <ul className="menu-subnav">
                  <li
                    className="menu-item menu-item-parent"
                    aria-haspopup="true"
                  >
                    <span className="menu-link">
                      <span className="menu-text">Tests</span>
                    </span>
                  </li>
                  {/* begin::2 Level */}
                  <li
                    className={`menu-item menu-item-submenu`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/speaking-test"
                    >
                      <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span>
                      <span className="menu-text">Speaking tests</span>
                      <i className="menu-arrow" />
                    </NavLink>
                    <div className="menu-submenu">
                      <i className="menu-arrow" />
                      <ul className="menu-subnav">
                        <li
                          className="menu-item menu-item-parent"
                          aria-haspopup="true"
                        >
                          <span className="menu-link">
                            <span className="menu-text">Speaking tests</span>
                          </span>
                        </li>
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/speaking/read-aloud"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/speaking/read-aloud"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Read Aloud</span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/speaking/repeat-sentence"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/speaking/repeat-sentence"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Repeat Sentence</span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/speaking/describe-image"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/speaking/describe-image"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Describe Image</span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/speaking/retell-lecture"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/speaking/retell-lecture"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Retell Lecture</span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/speaking/answer-short-question"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/speaking/answer-short-question"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Answer Short Question
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                      </ul>
                    </div>
                  </li>
                  {/* end::2 Level */}

                  {/* begin::2 Level */}
                  <li
                    className={`menu-item menu-item-submenu`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/writing-test"
                    >
                      <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span>
                      <span className="menu-text">Writing tests</span>
                      <i className="menu-arrow" />
                    </NavLink>
                    <div className="menu-submenu">
                      <i className="menu-arrow" />
                      <ul className="menu-subnav">
                        <li
                          className="menu-item menu-item-parent"
                          aria-haspopup="true"
                        >
                          <span className="menu-link">
                            <span className="menu-text">Writing tests</span>
                          </span>
                        </li>
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/writing/summarize-written-text"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/writing/summarize-written-text"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Summarize Written Text
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/writing/write-essay"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/writing/write-essay"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Write Essay</span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                      </ul>
                    </div>
                  </li>
                  {/* end::2 Level */}

                  {/* begin::2 Level */}
                  <li
                    className={`menu-item menu-item-submenu`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/reading-test"
                    >
                      <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span>
                      <span className="menu-text">Reading tests</span>
                      <i className="menu-arrow" />
                    </NavLink>
                    <div className="menu-submenu">
                      <i className="menu-arrow" />
                      <ul className="menu-subnav">
                        <li
                          className="menu-item menu-item-parent"
                          aria-haspopup="true"
                        >
                          <span className="menu-link">
                            <span className="menu-text">Reading tests</span>
                          </span>
                        </li>

                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/reading/multiple-choice-single-answer"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/reading/multiple-choice-single-answer"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Multiple Choice Single Answer
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/reading/multiple-choice-multiple-answer"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/reading/multiple-choice-multiple-answer"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Multiple Choice Multiple Answer
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/reading/reorder-paragraph"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/reading/reorder-paragraph"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Re-order Paragraph
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/reading/r-fill-in-the-blanks"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/reading/r-fill-in-the-blanks"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              R-Fill in the Blanks
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/reading/rw-fill-in-the-blanks"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/reading/rw-fill-in-the-blanks"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              RW-Fill in the Blanks
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                      </ul>
                    </div>
                  </li>
                  {/* end::2 Level */}

                  {/* begin::2 Level */}
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                      "/listening-test",
                      false
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/listening-test"
                    >
                      <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span>
                      <span className="menu-text">Listening tests</span>
                      <i className="menu-arrow" />
                    </NavLink>
                    <div className="menu-submenu">
                      <i className="menu-arrow" />
                      <ul className="menu-subnav">
                        <li
                          className="menu-item menu-item-parent"
                          aria-haspopup="true"
                        >
                          <span className="menu-link">
                            <span className="menu-text">Listening tests</span>
                          </span>
                        </li>
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/listening/summarize-spoken-text"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/listening/summarize-spoken-text"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Summarize Spoken Text
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/listening/multiple-choice-single-answer"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/listening/multiple-choice-single-answer"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Multiple Choice Single Answer
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/listening/multiple-choice-multiple-answer"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/listening/multiple-choice-multiple-answer"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Multiple Choice Multiple Answer
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/listening/fill-in-the-blanks"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/listening/fill-in-the-blanks"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Fill In The Blanks
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/listening/highlight-correct-summary"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/listening/highlight-correct-summary"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Highlight Correct Summary
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/listening/select-missing-word"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/listening/select-missing-word"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Select Missing Word
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/listening/highlight-incorrect-words"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/listening/highlight-incorrect-words"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Highlight Incorrect Words
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/listening/write-from-dictation"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/listening/write-from-dictation"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Write From Dictation
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                      </ul>
                    </div>
                  </li>
                  {/* end::2 Level */}
                </ul>
              </div>
            </li>
            {/* end::1 Level */}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item ${getMenuItemActive("/mock-test", false)}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/mock-test">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")}
                  />
                </span>
                <span className="menu-text">Mock test</span>
              </NavLink>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin" || "teacher") !=
          -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                "/up-comming-session"
              )} ${getMenuItemActive("/session")}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              <NavLink className="menu-link menu-toggle" to="/users">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")}
                  />
                </span>
                <span className="menu-text">Session booking management</span>
                <i className="menu-arrow" />
              </NavLink>
              <div className="menu-submenu">
                <i className="menu-arrow" />

                <ul className="menu-subnav">
                  <li
                    className="menu-item menu-item-parent"
                    aria-haspopup="true"
                  >
                    <span className="menu-link">
                      <span className="menu-text">
                        Session booking management
                      </span>
                    </span>
                  </li>
                  {/* begin::2 Level */}
                  {/* begin::3 Level */}
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/up-comming-session"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/up-comming-session">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Upcomming Sessions</span>
                    </NavLink>
                  </li>
                  {/* end::3 Level */}
                  {/* end::2 Level */}
                  {/* begin::2 Level */}
                  {/* begin::3 Level */}
                  <li
                    className={`menu-item ${getMenuItemActive("/session")}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/session">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Sessions List</span>
                    </NavLink>
                  </li>
                  {/* end::3 Level */}
                  {/* end::2 Level */}
                </ul>
              </div>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item ${getMenuItemActive("/package", false)}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/package">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")}
                  />
                </span>
                <span className="menu-text">Packages</span>
              </NavLink>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item ${getMenuItemActive("/tag", false)}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/tag">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")}
                  />
                </span>
                <span className="menu-text">Tags management</span>
              </NavLink>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item ${getMenuItemActive("/ticket", false)}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/ticket">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")}
                  />
                </span>
                <span className="menu-text">Tickets management</span>
              </NavLink>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin" || "teacher") !=
          -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item ${getMenuItemActive("/correction", false)}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/correction">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")}
                  />
                </span>
                <span className="menu-text">AI Manual Corrections</span>
              </NavLink>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item ${getMenuItemActive("/tutorial", false)}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/tutorial">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")}
                  />
                </span>
                <span className="menu-text">PTE Tutorial</span>
              </NavLink>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                "category"
              )} ${getMenuItemActive("course")} ${getMenuItemActive(
                "knowledge-tests-mcsa"
              )} ${getMenuItemActive("knowledge-tests-mcma")}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              <NavLink className="menu-link menu-toggle" to="/categories">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")}
                  />
                </span>
                <span className="menu-text">PTE-Course</span>
                <i className="menu-arrow" />
              </NavLink>
              <div className="menu-submenu">
                <i className="menu-arrow" />

                <ul className="menu-subnav">
                  <li
                    className="menu-item menu-item-parent"
                    aria-haspopup="true"
                  >
                    <span className="menu-link">
                      <span className="menu-text">PTE-Course</span>
                    </span>
                  </li>
                  {/* begin::2 Level */}
                  {/* begin::3 Level */}
                  <li
                    className={`menu-item ${getMenuItemActive("/category")}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/category">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Categories</span>
                    </NavLink>
                  </li>
                  {/* end::3 Level */}
                  {/* end::2 Level */}
                  {/* begin::2 Level */}
                  {/* begin::3 Level */}
                  <li
                    className={`menu-item ${getMenuItemActive("/course")}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/course">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Course</span>
                    </NavLink>
                  </li>
                  {/* end::3 Level */}
                  {/* end::2 Level */}
                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                      "knowledge-tests-mcsa"
                    )} ${getMenuItemActive("knowledge-tests-mcma")}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/knowledge-tests"
                    >
                      <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span>
                      <span className="menu-text">Knowledg Test</span>
                      <i className="menu-arrow" />
                    </NavLink>
                    <div className="menu-submenu">
                      <i className="menu-arrow" />
                      <ul className="menu-subnav">
                        <li
                          className="menu-item menu-item-parent"
                          aria-haspopup="true"
                        >
                          <span className="menu-link">
                            <span className="menu-text">Knowledg Test</span>
                          </span>
                        </li>

                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/knowledge-tests-mcsa"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/knowledge-tests-mcsa"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Multiple Choice Single Answer
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                        {/* begin::3 Level */}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/knowledge-tests-mcma"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/knowledge-tests-mcma"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              Multiple Choice Multiple Answer
                            </span>
                          </NavLink>
                        </li>
                        {/* end::3 Level */}
                      </ul>
                    </div>
                  </li>
                  {/* end::2 Level */}
                </ul>
              </div>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item ${getMenuItemActive("/scope", false)}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/scope">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")}
                  />
                </span>
                <span className="menu-text">Scope</span>
              </NavLink>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item ${getMenuItemActive(
                "/student-dashboard",
                false
              )}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/student-dashboard">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")}
                  />
                </span>
                <span className="menu-text">Student Dashboard</span>
              </NavLink>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}

        {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 ? (
          <>
            {/*begin::1 Level*/}
            <li
              className={`menu-item ${getMenuItemActive(
                "/question-reports",
                false
              )}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/question-reports">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")}
                  />
                </span>
                <span className="menu-text">Question Reports</span>
              </NavLink>
            </li>
            {/*end::1 Level*/}
          </>
        ) : null}
      </ul>
      {/* end::Menu Nav */}
    </>
  );
}
