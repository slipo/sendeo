import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { wallet, api } from '@cityofzion/neon-js'

import { net, contractScriptHash } from '../../AppConfig'

class WalletBalance extends Component {
  state = {
    neoBalance: 0,
    gasBalance: 0,
    errorMsg: '',
  }

  componentDidMount() {
    const {
      address,
    } = this.props

    const filledBalance = api.getBalanceFrom({ address, net }, api.neonDB).then(result => {
      this.setState({ neoBalance: result.balance.assets.NEO.balance.c[0], gasBalance: result.balance.assets.GAS.balance.c[0] })
    }).catch(error => {
      console.error(error)
    })
  }

  render() {
    const { neoBalance, gasBalance, errorMsg } = this.state
    let content = ''

    if (errorMsg === '') {
      content = (
        <h4>You have {neoBalance} NEO and {gasBalance} GAS available</h4>
      )
    }

    return content
  }
}

WalletBalance.propTypes = {
  address: PropTypes.string.isRequired,
}

export default WalletBalance
