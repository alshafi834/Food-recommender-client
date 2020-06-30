import React, { useEffect, useState, useContext } from "react";
import { Grid } from "@material-ui/core";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableContainer,
  TableBody,
  Paper,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Myfood = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const [dietTable, setDietTable] = useState(null);

  useEffect(() => {
    const getDietTables = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_API_BASE}/users/getdiettables`,
          "POST",
          JSON.stringify({
            userID: auth.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setDietTable(responseData);
        console.log(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    getDietTables();
  }, [sendRequest, auth.token, auth.userId]);

  console.log(dietTable);

  return (
    <div>
      <Grid container justify="center" spacing={0}>
        <Grid item xs={11}>
          {dietTable ? (
            <>
              <h3>Your food tables</h3>
              {dietTable.reverse().map((dbl, index) => {
                return (
                  <ExpansionPanel key={index} defaultExpanded={index === 0}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        Food Table {index + 1} - Created at: {dbl.created_at}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <TableContainer component={Paper}>
                        <Table aria-label="simple table" size="small">
                          <TableHead className="table-head">
                            <TableRow>
                              <TableCell>Food</TableCell>
                              <TableCell align="right">Calorie</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dbl.dietlist.map((row) => (
                              <TableRow key={row.Food_Name}>
                                <TableCell component="th" scope="row">
                                  {row.Food_Name}
                                </TableCell>
                                <TableCell align="right">
                                  {row.Calorie}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell component="th" scope="row">
                                Total
                              </TableCell>
                              <TableCell align="right">
                                {dbl.total_cal} calorie
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                );
              })}
            </>
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
};

export default Myfood;
