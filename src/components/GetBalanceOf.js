import { Component } from 'react'

import { GAS_ASSET_ID } from '../lib/const'
import { neonGetTxAssets, neonGetTxInfo } from '../lib/storage'

class GetBalanceOf extends Component {
  componentDidMount() {
    const { txId, contractScriptHash, net } = this.props
    this.getBalance(txId, contractScriptHash, net)
  }

  getBalance = (txId, contractScriptHash, net) => {
    neonGetTxAssets(txId, contractScriptHash, net)
      .then(assets => {
        console.log('balance res', assets)
        if (assets) {
          this.props.setBalanceState(assets)

          neonGetTxInfo(txId, contractScriptHash, net)
            .then(res => {
              console.log('escrow info', res)
            })
            .catch((e) => {
              console.log(e)
            })
        } else {
          this.props.setBalanceState(null)
        }
      })
      .catch((e) => {
        this.props.setBalanceState(null)
        console.log(e)
      })
  }

  render() {
    return ''
  }
}

export default GetBalanceOf
