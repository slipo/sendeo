import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { wallet } from '@cityofzion/neon-js'

import { neonJsClaim } from '../../../../../lib/neonWrappers'

class RescindButton extends Component {
  state = {
    isLoading: false,
    success: false,
    errorMsg: '',
  }

  rescindPreviousSend = () => {
    const { address, contractScriptHash, net, txId } = this.props

    this.setState({
      isLoading: true,
      success: false,
      errorMsg: '',
    })

    /*
     * Technically any account can do a rescind. This is fine bacause we actually automate this
     * with a Google function. However, since relying on a company to run a function isn't very
     * distributed, we leave this option for the person to do it manually.
     */
    const tmpAccount = new wallet.Account()
    neonJsClaim(address, tmpAccount.WIF, net, contractScriptHash, txId)
      .then((res) => {
        this.setState({
          errorMsg: '',
          success: true,
          isLoading: false,
        })
      })
      .catch((e) => {
        this.setState({
          isLoading: false,
          errorMsg: e.message,
          success: false,
        })
      })
  }

  render() {
    const { success, errorMsg, isLoading } = this.state

    if (success) {
      return (<div>SUCCESS!</div>)
    } else if (isLoading) {
      return (<div>Loading...</div>)
    } else {
      return (
        <div>
          <a href='#' onClick={ () => { this.rescindPreviousSend() } }>Rescind</a>
          { errorMsg !== '' && <div>ERROR: { errorMsg }</div> }
        </div>
      )
    }
  }
}

RescindButton.propTypes = {
  contractScriptHash: PropTypes.string.isRequired,
  net: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  txId: PropTypes.string.isRequired,
}

export default RescindButton
