import React from 'react';
import { BrowserRouter as Router, Route, NavLink, Switch } from 'react-router-dom';
import { Grid } from 'react-bootstrap';

import ClaimPage from './ClaimPage';
import SendPage from './SendPage';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './App.css';

const App = () => (
  <div>
    <Router>
      <Grid>
        <Switch>
          <Route exact path="/" component={SendPage} />
          <Route path="/claim/:key" component={ClaimPage} />
          <Route component={SendPage} />
        </Switch>
      </Grid>
    </Router>
  </div>
);

export default App;