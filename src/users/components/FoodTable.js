import React, { useContext } from "react";
import {
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TableSortLabel,
  TablePagination,
  Paper,
  Grid,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";

import "./FoodTable.css";

const FoodTable = ({ sgstdFoods, BMR }) => {
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Recommended Foods(100gm)",
    },
    { id: "category", numeric: false, disablePadding: true, label: "Category" },
    { id: "calories", numeric: true, disablePadding: false, label: "Calories" },
    { id: "fat", numeric: true, disablePadding: false, label: "Fat (g)" },
    { id: "carbs", numeric: true, disablePadding: false, label: "Carbs (g)" },
    {
      id: "protein",
      numeric: true,
      disablePadding: false,
      label: "Protein (g)",
    },
  ];

  function EnhancedTableHead(props) {
    /* const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props; */
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead className="table-head">
        <TableRow>
          {
            <TableCell padding="checkbox">
              {/* <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all desserts" }}
            /> */}
              &nbsp;&nbsp;&nbsp;&nbsp;+
            </TableCell>
          }
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "default"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span>{order === "desc" ? "" : ""}</span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("Category");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCalorie, setTotalCalorie] = React.useState(0);

  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const history = useHistory();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = sgstdFoods.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      setTotalCalorie(totalCalorie + parseInt(name.Calorie));
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      setTotalCalorie(totalCalorie - parseInt(name.Calorie));
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      setTotalCalorie(totalCalorie - parseInt(name.Calorie));
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      setTotalCalorie(totalCalorie - parseInt(name.Calorie));
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

  const saveDietTable = async () => {
    console.log(selected);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_API_BASE}/users/savediet`,
        "POST",
        JSON.stringify({
          userID: auth.userId,
          diettable: selected,
          total_cal: totalCalorie,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(responseData);
      history.push("/myfoods");
    } catch (error) {
      console.log(error);
    }
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  console.log(selected);

  return (
    <div className="tableContainer">
      <Grid item xs={7}>
        {sgstdFoods ? (
          <Paper>
            <TableContainer>
              <Table aria-labelledby="tableTitle" aria-label="enhanced table">
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={sgstdFoods.length}
                />
                <TableBody>
                  {stableSort(sgstdFoods, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.Food_Name}
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
                            {row.Food_Name}
                          </TableCell>
                          <TableCell align="right">{row.Category}</TableCell>
                          <TableCell align="right">{row.Calorie}</TableCell>
                          <TableCell align="right">{row.Fat}</TableCell>
                          <TableCell align="right">
                            {row.Carbohydrate}
                          </TableCell>
                          <TableCell align="right">{row.Protein}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={sgstdFoods.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        ) : null}
      </Grid>
      <Grid item xs={4}>
        {selected.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table aria-label="simple table" size="small">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell>Foods(100gm)</TableCell>
                    <TableCell align="right">BMR({BMR}±50)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selected.map((row) => (
                    <TableRow key={row.Food_Name}>
                      <TableCell component="th" scope="row">
                        {row.Food_Name}
                      </TableCell>
                      <TableCell align="right">{row.Calorie}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow
                    className={
                      "totalValueRow " +
                      (totalCalorie > BMR + 50
                        ? "high-alert"
                        : BMR - totalCalorie > 50
                        ? "low-alert"
                        : null)
                    }
                  >
                    <TableCell component="th" scope="row">
                      Total
                    </TableCell>
                    <TableCell align="right">{totalCalorie}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {totalCalorie > BMR + 50 ? (
              <p className="high-warn">
                You are exceeding your BMR. Keep your calorie level around {BMR}
              </p>
            ) : BMR - totalCalorie > 50 ? (
              <p className="low-warn">
                Select some more foods to reach the BMR
              </p>
            ) : (
              <>
                <p className="perfect-warn">Perfect diet for you</p>
                <button class="ft-btn" onClick={saveDietTable}>
                  Save diet table
                </button>
              </>
            )}
          </>
        ) : (
          <p>Select some food to make your own diet table!</p>
        )}
      </Grid>
    </div>
  );
};

export default FoodTable;
