import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.css'
import '../../knight-theme/style.css'
import '../../knight-theme/animate.css'
import '../../knight-theme/responsive.css'

import './App.css'

import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import ClaimPage from '../ClaimPage/ClaimPage'
import SendPage from '../SendPage/SendPage'
import LandingPage from '../LandingPage/LandingPage'
import PreviousSendsPage from '../PreviousSendsPage/PreviousSendsPage'
import AboutPage from '../AboutPage/AboutPage'

import { net, contractScriptHash } from '../../AppConfig'

const DefaultLayout = ({ children }) => (
  <div>
    <Header />
    {children}
    <Footer />
  </div>
)

const App = () => (
  <Router>
    <ScrollToTop>
      <DefaultLayout>
        <Switch>
          <Route path='/claim/:key/:receivedTxId' render={ props => <ClaimPage net={ net } contractScriptHash={ contractScriptHash } { ...props } /> }
          />
          <Route path='/previousSends' render={ props => <PreviousSendsPage net={ net } contractScriptHash={ contractScriptHash } { ...props } /> }
          />
          <Route path='/about' render={ props => <AboutPage { ...props } /> }
          />
          <Route path='/send' render={ props => <SendPage net={ net } contractScriptHash={ contractScriptHash } { ...props } /> }
          />
          <Route
            render={ props => <LandingPage /> }
          />
        </Switch>
      </DefaultLayout>
    </ScrollToTop>
  </Router>
)

export default App
