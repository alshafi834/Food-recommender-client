import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { Grid, FormGroup, FormControlLabel, Checkbox } from "@material-ui/core";

import "./Users.css";

const Users = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [userProfileInfo, setUserProfileInfo] = useState(null);
  const [disease, setDisease] = useState({
    ckd: false,
    diabates: false,
    bloodpressure: false,
  });

  const handleDiseaseChange = (event) => {
    setDisease({ ...disease, [event.target.name]: event.target.checked });
  };
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
          "http://localhost:5000/api/users",
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
                    />
                  }
                  label="Diabates"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleDiseaseChange}
                      checked={disease.bloodpressure}
                      name="bloodpressure"
                    />
                  }
                  label="Blood Pressure"
                />
              </FormGroup>
            </Grid>
          </div>
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
