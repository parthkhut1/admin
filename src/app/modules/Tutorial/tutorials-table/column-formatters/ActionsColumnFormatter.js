// please be familiar with react-bootstrap-table-next column formaters
// https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html?selectedKind=Work%20on%20Columns&selectedStory=Column%20Formatter&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

export const ActionsColumnFormatter = (
  cellContent,
  row,
  rowIndex,
  { openEditTutorialDialog, openDeleteTutorialDialog }
) => {
  // sessions Redux state
  // const dispatch = useDispatch();
  // const { actionsLoading, sessionForEdit } = useSelector(
  //   (state) => ({
  //     actionsLoading: state.sessions.actionsLoading,
  //     sessionForEdit: state.sessions.sessionForEdit,
  //   }),
  //   shallowEqual
  // );
  return (
    <>
      {/* <a
        title="Go to meeting"
        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
        target="_blank"
        rel="noopener noreferrer"
        href={`${sessionForEdit?.holder_data?.start_url}`}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Communication/Sending.svg")}
          />
        </span>
      </a> */}

      <a
        title="Edit Session"
        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
        onClick={() => openEditTutorialDialog(row)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
          />
        </span>
      </a>

      <a
        title="Delete Session"
        className="btn btn-icon btn-light btn-hover-danger btn-sm"
        onClick={() => openDeleteTutorialDialog(row.id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-danger">
          <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
        </span>
      </a>
    </>
  );
};

