import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import {
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tabs,
  AppBar,
  Tab,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import "./Users.css";
import FoodTable from "./FoodTable";
import AvoidFoodTable from "./AvoidFoodTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

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
  const [avoidableFoods, setAvoidableFoods] = useState(null);
  const [BMR, setBMR] = useState(null);
  //const [totalCalorie, setTotalCalorie] = useState(0);
  //const [selectedFoods, setSelectedFoods] = useState([]);

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleDiseaseChange = (event) => {
    setDisease({ ...disease, [event.target.name]: event.target.checked });

    setSelectedDisease(event.target.value);
  };

  //const [age, setAge] = React.useState('');

  const handleChange = (event) => {
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
          userID: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setSgstdFoods(responseData.suggestedFoods);
      setAvoidableFoods(responseData.avoidedFoods);
      setBMR(responseData.bmr);
    } catch (error) {
      console.log(error);
    }
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

  /* const calculateDiet = (event) => {
    const foodToAdd = JSON.parse(event.target.value);
    setTotalCalorie(totalCalorie + parseInt(foodToAdd.Calorie));

    setSelectedFoods([...selectedFoods, foodToAdd]);
  }; */

  /* console.log(selectedFoods);
  console.log(BMR);
  console.log(totalCalorie); */

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  console.log(sgstdFoods);

  if (!userProfileInfo) return null;

  return (
    <div>
      <Grid container justify="center" spacing={0}>
        <Grid item xs={11}>
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
              {/* <FormGroup>
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
                  label="Dyslipidemia"
                />
              </FormGroup> */}
              <FormControl className="dropbox-select">
                <InputLabel id="select-disease">Select Disease</InputLabel>
                <Select
                  labelId="select-disease"
                  id="demo-simple-select"
                  value={selectedDisease}
                  onChange={handleChange}
                >
                  <MenuItem value="CKD_Allowed">CKD</MenuItem>
                  <MenuItem value="Diabetes_Type1_allowed">Diabates</MenuItem>
                  <MenuItem value="Dyslipidemia_HighColestrol_Allowed">
                    Dyslipidemia
                  </MenuItem>
                </Select>
              </FormControl>{" "}
              <br></br>
              <button className="analyze-btn" onClick={findFoodByDisease}>
                Find Food
              </button>
            </Grid>
          </div>
          <div>
            {sgstdFoods ? (
              <div className="food-result">
                <AppBar position="static" color="default">
                  <Tabs
                    value={value}
                    onChange={handleChangeTab}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                  >
                    <Tab label="Recommended Food" {...a11yProps(0)} />
                    <Tab label="Foods to avoid" {...a11yProps(1)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={value} index={0} dir={theme.direction}>
                  <FoodTable sgstdFoods={sgstdFoods} BMR={BMR} />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                  <AvoidFoodTable avoidableFoods={avoidableFoods} />
                </TabPanel>
              </div>
            ) : null}
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
