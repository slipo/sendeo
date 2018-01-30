import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap'
import { wallet, u } from '@cityofzion/neon-js'
import Sticky from 'react-stickynode'
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor'

import OwnedEscrowList from '../components/OwnedEscrowList'
import CheckLoggedIn from '../components/CheckLoggedIn'
import './PreviousSendsPage.css'

configureAnchors({ offset: -80, scrollDuration: 500 })

class PreviousSends extends Component {
  state = {
    extensionState: {
      neoLinkConnected: null,
      isLoggedIn: null,
      address: null,
    },
    previousSends: false,
  }

  setExtensionState = (neoLinkConnected, isLoggedIn, address) => {
    this.setState({ extensionState: { neoLinkConnected, isLoggedIn, address } })
  }

  setPreviousSendsState = (previousSends) => {
    this.setState({ previousSends })
  }

  render() {
    const {
      extensionState,
    } = this.state

    const { contractScriptHash, net } = this.props

    return (
      <div>
        <Sticky>
          <nav className='main-nav-outer'>
            <div className='container'>
              <ul className='main-nav'>
                <li><Link to='/?asset=neo#get-started'>Send NEO</Link></li>
                <li><Link to='/?asset=gas#get-started'>Send GAS</Link></li>
                <li><Link to='/previousSends'>Previous Sends</Link></li>
                <li><Link to='/about'>About</Link></li>
              </ul>
              <a className='res-nav_click' href='#'>
                <i className='fa-bars' />
              </a>
              <CheckLoggedIn setExtensionState={ this.setExtensionState } extensionState={ extensionState } />
            </div>
          </nav>
        </Sticky>

        <section className='main-section'>
          <div className='container'>
            <ScrollableAnchor id={ 'get-started' } offset={ '400' }>
              <h2>Here Is a List of Your Previous Sends</h2>
            </ScrollableAnchor>

            <h6>If a deposit has not been claimed after 7 days, you can come to this page and rescind your send.</h6>

            <div className='row'>
              <div className='col-sm-6 col-sm-offset-3 wow fadeInLeft delay-05s'>

                { extensionState.address &&
                  <OwnedEscrowList
                    address={ extensionState.address }
                    contractScriptHash={ contractScriptHash }
                    setPreviousSendsState={ this.setPreviousSendsState }
                    net={ net }
                  />
                }

                <div className='text-center'><Link to='/'><i className='fa fa-fw fa-arrow-left' /> Go back to the Send Page</Link></div>
              </div>
            </div>
          </div>
        </section>

        <pre>
          <code>
            { JSON.stringify(this.state, null, 2) }
          </code>
        </pre>

      </div>
    )
  }
}

export default PreviousSends
