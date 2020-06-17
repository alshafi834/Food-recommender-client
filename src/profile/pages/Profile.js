import React from "react";
import { Grid, TextField } from "@material-ui/core";

const Profile = () => {
  return (
    <div>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={6}>
          <h3>Edit your profile - (in progress)</h3>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="uname"
              label="User Name"
              value=""
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
              value=""
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
              value=""
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
              value=""
              type="number"
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
