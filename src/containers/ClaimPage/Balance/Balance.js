import { Component } from 'react'
import { u } from '@cityofzion/neon-js'

import { neonGetTxAssets, neonGetTxInfo, neonGetIsUnspent } from '../../../lib/storage'

class GetBalanceOf extends Component {
  componentDidMount() {
    const { txId, contractScriptHash, net } = this.props
    this.getBalance(txId, contractScriptHash, net)
  }

  getBalance = (txId, contractScriptHash, net) => {
    neonGetTxAssets(txId, contractScriptHash, net)
      .then(assets => {
        if (assets) {
          neonGetTxInfo(u.reverseHex(txId), contractScriptHash, net)
            .then(txRes => {
              return this.props.setBalanceState(assets, txRes.spent, txRes.created, txRes.note)
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
