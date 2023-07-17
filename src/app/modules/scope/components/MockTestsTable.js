import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import FilterListIcon from "@material-ui/icons/FilterList";
import { format } from "date-fns";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { useHistory, Link } from "react-router-dom";

import * as actions from "../_redux/scopesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const headCells = [
  { id: "Name", numeric: false, disablePadding: true, label: "Name" },
  {
    id: "Valid Till",
    numeric: true,
    disablePadding: false,
    label: "Valid Till",
  },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = ({
  hasRemoveButtom,
  selected,
  onAdd,
  onRemove,
}) => {
  const classes = useToolbarStyles();
  const numSelected = selected.length;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Mock Tests
        </Typography>
      )}

      {numSelected > 0 ? (
        !hasRemoveButtom ? (
          <Tooltip title="Add">
            <IconButton aria-label="add">
              <AddCircleOutlineIcon
                onClick={onAdd}
                fontSize="large"
                color="primary"
              />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Remove">
            <IconButton aria-label="remove">
              <RemoveCircleOutlineIcon
                onClick={onRemove}
                fontSize="large"
                color="error"
              />
            </IconButton>
          </Tooltip>
        )
      ) : null}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable({
  filterdMockTests = [],
  hasRemoveBtn = false,
  onAdd,
  onRemove,
  filterValues,
}) {
  const classes = useStyles();
  const history = useHistory();
  // packages Redux state
  const dispatch = useDispatch();
  const { total, currentPageMocks } = useSelector(
    (state) => ({
      currentPageMocks: state.scopes.currentPageMocks,
      total: state.scopes.totalCountOfFilteredMocks,
    }),
    shallowEqual
  );

  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filterdMockTests.map((n) => ({
        id: n.id,
        billable_id: n.billable_id,
        name: n.name,
      }));
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, row) => {
    // const selectedIndex = selected.indexOf(row.id);
    const selectedIndex = selected.findIndex((i) => i.id === row.id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, {
        id: row.id,
        billable_id: row.billable_id,
        name: row.name,
      });
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.findIndex((i) => i.id === id) !== -1;

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filterdMockTests.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      {filterdMockTests.length !== 0 ? (
        <>
          <EnhancedTableToolbar
            selected={selected}
            hasRemoveButtom={hasRemoveBtn}
            onAdd={() => onAdd(selected)}
            onRemove={() => onRemove(selected)}
          />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                onSelectAllClick={handleSelectAllClick}
                rowCount={filterdMockTests.length}
              />
              <TableBody>
                {filterdMockTests
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {/* <Link
                            to={`/${row?.category?.toLowerCase()}/${row.question_name
                              // .replace(/([A-Z])/g, " $1")
                              .replace(/^\s+/g, "")
                              .toLowerCase()
                              .split(" ")
                              .join("-")}/${row.id}/edit`}
                          > */}
                          {row.name}
                          {/* </Link> */}
                        </TableCell>
                        <TableCell align="center">
                          {format(new Date(row.valid_till), "yyyy-MM-dd")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 30, 50, 75, 100]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={currentPageMocks - 1}
            onChangePage={(e, number) => {
              handleChangePage(e, number);
              dispatch(
                actions.fetchFilteredMocks({
                  ...filterValues,
                  page: number + 1,
                  per_page: rowsPerPage,
                })
              );
            }}
            onChangeRowsPerPage={(e) => {
              handleChangeRowsPerPage(e);
              const { value } = e.target;
              dispatch(
                actions.fetchFilteredMocks({
                  ...filterValues,
                  page: 1,
                  per_page: value,
                })
              );
            }}
          />
        </>
      ) : (
        "There are no mock tests"
      )}
    </div>
  );
}
