import React, { useEffect, useContext, useState } from "react";
import { Grid, TextField, Container, Button } from "@material-ui/core";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./profile.css";

const Profile = () => {
  const auth = useContext(AuthContext);
  const { sendRequest, isLoading } = useHttpClient();

  const [userProfileInfo, setUserProfileInfo] = useState(null);

  const [btnDisalbe, setBtnDisable] = useState(true);

  const handleChange = (prop) => (event) => {
    setUserProfileInfo({ ...userProfileInfo, [prop]: event.target.value });
    setBtnDisable(false);
  };

  const editSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_API_BASE}/users/editprofileinfo`,
        "POST",
        JSON.stringify({
          email: userProfileInfo.email,
          username: userProfileInfo.username,
          age: userProfileInfo.age,
          height: userProfileInfo.height,
          weight: userProfileInfo.weight,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(responseData);
      setBtnDisable(true);
    } catch (error) {
      console.log(error);
    }
  };

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
      } catch (error) {
        console.log(error);
      }
    };
    getUserProfile();
  }, [sendRequest, auth.token, auth.userId]);

  return (
    <div>
      <Container maxWidth="sm">
        {userProfileInfo ? (
          <div className="profile-container">
            <h3>Edit your profile </h3>
            <form noValidate autoComplete="off" onSubmit={editSubmitHandler}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="username"
                    label="User Name"
                    value={userProfileInfo.username}
                    onChange={handleChange("username")}
                    type="text"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="age"
                    label="Age"
                    value={userProfileInfo.age}
                    onChange={handleChange("age")}
                    type="text"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="height"
                    label="Height(cm)"
                    value={userProfileInfo.height}
                    onChange={handleChange("height")}
                    type="number"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="weight"
                    label="Weight(kg)"
                    value={userProfileInfo.weight}
                    onChange={handleChange("weight")}
                    type="number"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                    disabled={btnDisalbe}
                  >
                    {isLoading ? "Updating..." : "Update"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        ) : null}
      </Container>
    </div>
  );
};

export default Profile;
