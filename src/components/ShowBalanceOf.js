import React, { Component } from 'react'
import { wallet, u } from '@cityofzion/neon-js'

import { GAS_ASSET_ID } from '../lib/const'
import { neonGetBalance } from '../lib/storage'

class ShowBalanceOf extends Component {
  state = {
    balanceNeo: '',
    errorMsg: '',
    isLoading: true,
  }

  componentDidMount() {
    const { escrowPrivateKey, contractScriptHash, net } = this.props
    this.getBalance(escrowPrivateKey, contractScriptHash, net)
  }

  getBalance = (escrowPrivateKey, contractScriptHash, net) => {
    const escrowAccount = new wallet.Account(escrowPrivateKey)
    neonGetBalance(escrowAccount.scriptHash, GAS_ASSET_ID, contractScriptHash, net)
      .then(res => {
        console.log('balance res', res)
        if (res.result) {
          this.setState({
            balanceNeo: u.fixed82num(res.result),
            errorMsg: '',
            isLoading: false,
          })
        } else {
          this.setState({
            balanceNeo: '',
            errorMsg: 'No balance found',
            isLoading: false,
          })
        }
      })
      .catch((e) => {
        this.setState({
          balanceNeo: '',
          errorMsg: e.message,
          isLoading: false,
        })
        console.log(e)
      })
  }

  render() {
    const { isLoading, errorMsg, balanceNeo } = this.state

    let content
    if (isLoading) {
      content = 'Loading balance information'
    } else if (errorMsg !== '') {
      content = `Error: ${errorMsg}`
    } else {
      content = `${balanceNeo}`
    }

    return (
      <div>
        Total balance GAS: { content }
      </div>
    )
  }
}

export default ShowBalanceOf
