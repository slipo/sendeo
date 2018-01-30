import React, { Component } from 'react'
import { wallet, u } from '@cityofzion/neon-js'

import { GAS_ASSET_ID } from '../lib/const'
import { neonGetBalance, neonGetEscrowInfo } from '../lib/storage'

class GetBalanceOf extends Component {
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
          const txAmount = u.fixed82num(res.result)
          this.props.setBalanceState(txAmount)

          neonGetEscrowInfo(escrowAccount.scriptHash, contractScriptHash, net)
            .then(res => {
              console.log('escrow info', res)
            })
            .catch((e) => {
              console.log(e)
            })
        } else {
          this.props.setBalanceState(0)
        }
      })
      .catch((e) => {
        this.props.setBalanceState(0)
        console.log(e)
      })
  }

  render() {
    return ''
  }
}

export default GetBalanceOf
