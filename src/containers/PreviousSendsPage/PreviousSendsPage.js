import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

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

  render() {
    const {
      extensionState,
    } = this.state

    const { contractScriptHash, net } = this.props

    return (
      <div>
        <CheckLoggedIn setExtensionState={ this.setExtensionState } extensionState={ extensionState } />

        <section className='main-section'>
          <div className='container'>
            <h2 className='page-title'>Here Is a List of Your Previous Sends</h2>

            <h6>If a deposit has not been claimed after 7 days, you can come to this page and rescind your send.</h6>

            <div className='row'>
              <div className='col-sm-10 col-sm-offset-1'>
                { extensionState.address &&
                  <OwnedEscrowList
                    address={ extensionState.address }
                    contractScriptHash={ contractScriptHash }
                    net={ net }
                  />
                }

                <hr />
                <div className='text-center'><Link to='/send'><i className='fa fa-fw fa-arrow-left' /> Go back to the Send Page</Link></div>
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
