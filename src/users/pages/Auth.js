import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [values, setValues] = React.useState({
    uname: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    email: "",
    password: "",
  });
  const [signUpMode, setSignUpMode] = React.useState(true);

  /* const { isLoading, errorMsg, sendRequest, clearError } = useHttpClient(); */
  const { errorMsg, sendRequest } = useHttpClient();

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (signUpMode) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_API_BASE}/users/signup`,
          "POST",
          JSON.stringify({
            username: values.uname,
            email: values.email,
            password: values.password,
            age: values.age,
            gender: values.gender,
            height: values.height,
            weight: values.weight,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
        console.log(responseData);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_API_BASE}/users/login`,
          "POST",
          JSON.stringify({
            email: values.email,
            password: values.password,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
        console.log(responseData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const changeMode = () => {
    setSignUpMode((prevMode) => !prevMode);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  return (
    <Container maxWidth="sm">
      <div className="authContainer">
        <div className="formHeader">
          <div>
            <h2>{signUpMode ? "Sign Up" : "Login"}</h2>
          </div>
          <div>
            <span>Switch to</span>
            <button onClick={changeMode}>
              {signUpMode ? "Login" : "Sign Up"}
            </button>
          </div>
        </div>

        <form noValidate autoComplete="off" onSubmit={authSubmitHandler}>
          <Grid container spacing={3}>
            {signUpMode ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="uname"
                  label="User Name"
                  onChange={handleChange("uname")}
                  value={values.uname}
                  type="text"
                  variant="outlined"
                  size="small"
                />
              </Grid>
            ) : null}
            {signUpMode ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="age"
                  label="Age"
                  onChange={handleChange("age")}
                  value={values.age}
                  type="text"
                  variant="outlined"
                  size="small"
                />
              </Grid>
            ) : null}
            {signUpMode ? (
              <Grid item xs={12}>
                <RadioGroup
                  row
                  aria-label="gender"
                  name="gender"
                  value={values.gender}
                  onChange={handleChange("gender")}
                  size="small"
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio color="primary" />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio color="primary" />}
                    label="Male"
                  />
                </RadioGroup>
              </Grid>
            ) : null}
            {signUpMode ? (
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="height"
                  label="Height(cm)"
                  onChange={handleChange("height")}
                  value={values.height}
                  type="number"
                  variant="outlined"
                  size="small"
                />
              </Grid>
            ) : null}
            {signUpMode ? (
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="weight"
                  label="Weight(kg)"
                  onChange={handleChange("weight")}
                  value={values.weight}
                  type="number"
                  variant="outlined"
                  size="small"
                />
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                label="Email"
                onChange={handleChange("email")}
                value={values.email}
                type="Email"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="password"
                label="Password"
                onChange={handleChange("password")}
                value={values.password}
                type="password"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <p className="errorMsg">{errorMsg}</p>
              <Button variant="outlined" color="primary" type="submit">
                {signUpMode ? "Sign Up" : "Login"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Auth;
