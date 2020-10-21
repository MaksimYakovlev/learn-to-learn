import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Fetch from './Fetch';
import MainDirectories from './HomePage/MainDirectories';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import CreateMain from './Content/CreateMain';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function Body() {
  const currentDirectory = useSelector((state) => state.currentDirectory.id);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={3}
        justify="center"
        // alignItems="top"
      >
        <Grid item sm={6} className="mt-3">
          <Grid
            container
            spacing={3}
            justify="center"
            // alignItems="center"
          >
            <Grid item sm={9}>
              <Breadcrumbs />
            </Grid>
            <Grid item sm={12}>
              <MainDirectories />
              <Route path="/new">
                <CreateMain directory={currentDirectory} />
              </Route>
            </Grid>

          </Grid>
        </Grid>
        <Grid item sm={3} className="mt-3">
          <Fetch />
        </Grid>
      </Grid>
    </div>
  );
}

export default Body;
