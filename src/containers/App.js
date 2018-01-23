import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import ClaimPage from './ClaimPage'
import SendPage from './SendPage'

import 'bootstrap/dist/css/bootstrap.css'
import '../knight-theme/style.css'
import '../knight-theme/animate.css'
import '../knight-theme/responsive.css'

import './App.css'

const App = () => (
  <Router>
    <Switch>
      <Route exact path='/' component={ SendPage } />
      <Route path='/claim/:key' component={ ClaimPage } />
      <Route component={ SendPage } />
    </Switch>
  </Router>
)

export default App
