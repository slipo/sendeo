import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import ClaimPage from './ClaimPage'
import SendPage from './SendPage'

import 'bootstrap/dist/css/bootstrap.css'
import '../knight-theme/style.css'
import '../knight-theme/animate.css'
import '../knight-theme/responsive.css'

import './App.css'
import { net, contractScriptHash } from './AppConfig'

const App = () => (
  <Router>
    <Switch>
      <Route path='/claim/:key' render={
        props => <ClaimPage net={ net } contractScriptHash={ contractScriptHash } { ...props } /> }
      />
      <Route
        render={ props => <SendPage net={ net } contractScriptHash={ contractScriptHash } { ...props } /> }
      />
    </Switch>
  </Router>
)

export default App
