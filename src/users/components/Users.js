import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { NavLink } from "react-router-dom";
import {
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tabs,
  AppBar,
  Tab,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
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
  const { sendRequest, isLoading } = useHttpClient();
  const [userProfileInfo, setUserProfileInfo] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState("");

  const [sgstdFoods, setSgstdFoods] = useState(null);
  const [avoidableFoods, setAvoidableFoods] = useState(null);
  const [BMR, setBMR] = useState(null);

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const [subDisease, setSubDisease] = useState(null);
  const [finalDisease, setFinalDisease] = useState([]);

  const handleDiseaseChange = (event) => {
    setSubDisease(event.target.value);
  };

  const handleChange = (event) => {
    if (desieaseList[event.target.value].length > 1) {
      setSelectedDisease(event.target.value);
      setSubDisease(null);
    } else {
      setSelectedDisease(event.target.value);
      setSubDisease(event.target.value);
    }
  };

  const diseaseDisplayName = {
    CKD: "CKD",
    Diabetes_Type1: "Diabetes - Type 1",
    Diabates_Type2: "Diabates - Type 2",
    Dyslipidemia_HighColestrol: "Dyslipidemia with Hign Colostrol",
    Dyslipidemia_LowColestrol: "Dyslipidemia with Low Colostrol",
  };

  const desieaseList = {
    CKD: ["CKD"],
    Diabates: ["Diabetes_Type1", "Diabates_Type2"],
    Dyslipidemia: ["Dyslipidemia_HighColestrol", "Dyslipidemia_LowColestrol"],
  };
  let [diseaseDropDown, setDiseaseDropDown] = useState([
    "CKD",
    "Diabates",
    "Dyslipidemia",
  ]);

  const addDisease = () => {
    setFinalDisease([...finalDisease, subDisease]);
    popDisease(selectedDisease);
    setSelectedDisease("");
  };

  const popDisease = (sds) => {
    for (let i = 0; i < diseaseDropDown.length; i++) {
      if (diseaseDropDown[i] === sds) {
        diseaseDropDown.splice(i, 1);
        setDiseaseDropDown(diseaseDropDown);
      }
    }
  };

  const findFoodByDisease = async () => {
    console.log(selectedDisease);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_API_BASE}/users/findfood`,
        "POST",
        JSON.stringify({
          disease: finalDisease,
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

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  console.log(sgstdFoods);
  //console.log(finalDisease);

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
            <Grid item xs={4}>
              <p>
                <u>User Details: </u>
                <span>
                  <NavLink to="/profile">(Edit)</NavLink>
                </span>
              </p>
              <p>Age: {userProfileInfo.age}</p>
              <p>Gender: {userProfileInfo.gender}</p>
              <p>height: {userProfileInfo.height}</p>
              <p>weight: {userProfileInfo.weight}</p>
            </Grid>
            <Grid item xs={4}>
              <p>
                {finalDisease.length < 1
                  ? "Which diseases you are suffering with?"
                  : "Are you suffering with more disease?"}{" "}
              </p>
              <FormControl className="dropbox-select">
                <InputLabel id="select-disease">Select Disease</InputLabel>
                <Select
                  labelId="select-disease"
                  id="demo-simple-select"
                  value={selectedDisease}
                  onChange={handleChange}
                >
                  {diseaseDropDown.map((ddd) => {
                    return (
                      <MenuItem value={ddd} key={ddd}>
                        {ddd}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>{" "}
              <br></br>
              {selectedDisease && desieaseList[selectedDisease].length > 1 ? (
                <RadioGroup
                  aria-label="sub-disease"
                  name="sub-disease"
                  value={subDisease}
                  onChange={handleDiseaseChange}
                  size="small"
                >
                  {desieaseList[selectedDisease].map((dss) => {
                    return (
                      <FormControlLabel
                        value={dss}
                        key={dss}
                        control={<Radio color="primary" />}
                        label={diseaseDisplayName[dss]}
                      />
                    );
                  })}
                </RadioGroup>
              ) : null}
              <button
                className="analyze-btn"
                onClick={addDisease}
                disabled={!selectedDisease || !subDisease}
              >
                Add Disease
              </button>
            </Grid>
            <Grid item xs={4}>
              {finalDisease.length > 0 ? (
                <div>
                  <ul className="final-disease-list">
                    {finalDisease.map((fds) => {
                      return (
                        <li className="final-diseases" key={fds}>
                          {diseaseDisplayName[fds]}
                        </li>
                      );
                    })}
                  </ul>
                  <button className="analyze-btn" onClick={findFoodByDisease}>
                    {isLoading ? "Finding your foods..." : "Find Foods"}
                  </button>
                </div>
              ) : null}
            </Grid>
          </div>
          <div>
            {isLoading ? <LinearProgress className="loading" /> : null}
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
    </div>
  );
};

export default Users;
