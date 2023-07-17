import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { ReportsFilter } from "./reports-filter/ReportsFilter";
import { ReportsTable } from "./reports-table/ReportsTable";
import { ReportsGrouping } from "./reports-grouping/ReportsGrouping";
import { useReportsUIContext } from "./ReportsUIContext";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "./_redux/reportsActions";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  exportBtn: {
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

export function ReportsCard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const reportsUIContext = useReportsUIContext();
  const reportsUIProps = useMemo(() => {
    return {
      ids: reportsUIContext.ids,
      newreportButtonClick: reportsUIContext.newreportButtonClick,
    };
  }, [reportsUIContext]);
  const { actionsLoading, questionReports } = useSelector(
    (state) => ({
      questionReports: state.reports.entities,
      actionsLoading: state.reports.actionsLoading,
    }),
    shallowEqual
  );

  return (
    <Card>
      <CardHeader title="reports list">
        <CardHeaderToolbar>
          {/* <button
            type="button"
            className="btn btn-primary"
            onClick={reportsUIProps.newreportButtonClick}
          >
            New Report
          </button> */}

          <Grid container justify="flex-end" alignItems="center">
            <Button
              variant="primary"
              classes={{
                root: classes.exportBtn,
                label: classes.exportBtnLabel,
                disabled: classes.disabled,
              }}
              disabled={questionReports?.length == 0}
              onClick={() => {
                if (questionReports?.length != 0)
                  dispatch(actions.fetchExportList());
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
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <ReportsFilter />
        {reportsUIProps.ids.length > 0 && <ReportsGrouping />}
        <ReportsTable />
      </CardBody>
    </Card>
  );
}
