import { Component } from 'react'
import { u } from '@cityofzion/neon-js'

import { neonGetTxAssets, neonGetTxInfo, neonGetIsUnspent } from '../lib/storage'

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
          let note
          let created

          neonGetTxInfo(u.reverseHex(txId), contractScriptHash, net)
            .then(txRes => {
              note = txRes.note
              created = txRes.created
              return neonGetIsUnspent(txId, contractScriptHash, net)
            })
            .then(unspent => {
              this.props.setBalanceState(assets, !unspent, created, note)
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
