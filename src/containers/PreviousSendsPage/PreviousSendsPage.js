import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Header from '../../components/Header/Header'
import OwnedEscrowList from './OwnedEscrowList/OwnedEscrowList'
import CheckLoggedIn from '../../components/CheckLoggedIn/CheckLoggedIn'

import './PreviousSendsPage.css'

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
        <span>
          <Header />
          <CheckLoggedIn setExtensionState={ this.setExtensionState } extensionState={ extensionState } />
        </span>

        <section className='main-section'>
          <div className='container'>
            <h2>Here Is a List of Your Previous Sends</h2>

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
      </div>
    )
  }
}

PreviousSends.propTypes = {
  contractScriptHash: PropTypes.string,
  net: PropTypes.string,
}

export default PreviousSends
