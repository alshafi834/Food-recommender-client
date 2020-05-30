import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import {
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@material-ui/core";

import "./Users.css";

const Users = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [userProfileInfo, setUserProfileInfo] = useState(null);
  const [disease, setDisease] = useState({
    ckd: false,
    diabates: false,
    dyslipidemia: false,
  });
  const [selectedDisease, setSelectedDisease] = useState(null);

  const [sgstdFoods, setSgstdFoods] = useState(null);

  const handleDiseaseChange = (event) => {
    setDisease({ ...disease, [event.target.name]: event.target.checked });

    setSelectedDisease(event.target.value);
  };

  const findFoodByDisease = async () => {
    console.log(selectedDisease);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_API_BASE}/users/findfood`,
        "POST",
        JSON.stringify({
          disease: selectedDisease,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setSgstdFoods(responseData);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(sgstdFoods);
  //const [loadedUsers, setLoadedUsers] = useState();

  /* useEffect(() => {
    const getUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );

        setLoadedUsers(responseData.users);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [sendRequest, auth.token]); */

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_API_BASE}/users`,
          "POST",
          JSON.stringify({
            userID: auth.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setUserProfileInfo(responseData);
        console.log(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    getUserProfile();
  }, [sendRequest, auth.token, auth.userId]);

  if (!userProfileInfo) return null;

  return (
    <div>
      <Grid container justify="center" spacing={5}>
        <Grid item xs={10}>
          <h3>
            Hello {userProfileInfo.username}, welcome to food recommender. Let's
            find your food!
          </h3>
          <div className="food-recommender">
            <Grid item xs={6}>
              <p>
                <u>User Details:</u>
              </p>
              <p>Age: {userProfileInfo.age}</p>
              <p>Gender: {userProfileInfo.gender}</p>
              <p>height: {userProfileInfo.height}</p>
              <p>weight: {userProfileInfo.weight}</p>
            </Grid>
            <Grid item xs={6}>
              <p>Which diseases you are suffering with?</p>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleDiseaseChange}
                      checked={disease.ckd}
                      name="ckd"
                      value="CKD_Allowed"
                    />
                  }
                  label="CKD"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleDiseaseChange}
                      checked={disease.diabates}
                      name="diabates"
                      value="Diabetes_Type1_allowed"
                    />
                  }
                  label="Diabates"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleDiseaseChange}
                      checked={disease.dyslipidemia}
                      name="dyslipidemia"
                      value="Dyslipidemia_HighColestrol_Allowed"
                    />
                  }
                  label="Blood Pressure"
                />
              </FormGroup>
              <button className="analyze-btn" onClick={findFoodByDisease}>
                Find Food
              </button>
            </Grid>
          </div>
          <Grid item xs={8}>
            {sgstdFoods ? (
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Food</TableCell>
                      <TableCell align="right">Calories</TableCell>
                      <TableCell align="right">Fat&nbsp;(g)</TableCell>
                      <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                      <TableCell align="right">Protein&nbsp;(g)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sgstdFoods.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                          {row.Food_Name}
                        </TableCell>
                        <TableCell align="right">{row.Calorie}</TableCell>
                        <TableCell align="right">{row.Fat}</TableCell>
                        <TableCell align="right">{row.Carbohydrate}</TableCell>
                        <TableCell align="right">{row.Protein}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
          </Grid>
        </Grid>
      </Grid>

      {/* {loadedUsers && (
        <ul>
          {loadedUsers.map((user) => {
            return <li key={user.id}>{user.username}</li>;
          })}
        </ul>
      )} */}
    </div>
  );
};

export default Users;
