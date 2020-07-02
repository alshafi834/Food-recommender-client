import React from "react";
import {
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Paper,
} from "@material-ui/core";
import "./AvoidFoodTable.css";

const AvoidFoodTable = ({ avoidableFoods }) => {
  return (
    <div>
      {avoidableFoods ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead className="avoid-table-head">
              <TableRow>
                <TableCell>Foods(100gm)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {avoidableFoods.map((row) => (
                <TableRow key={row.Food_Name}>
                  <TableCell component="th" scope="row">
                    {row.Food_Name}
                  </TableCell>
                  <TableCell align="right">{row.Calorie}</TableCell>
                  <TableCell align="right">{row.Category}</TableCell>
                  <TableCell align="right">{row.Fat}</TableCell>
                  <TableCell align="right">{row.Carbohydrate}</TableCell>
                  <TableCell align="right">{row.Protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </div>
  );
};

export default AvoidFoodTable;
