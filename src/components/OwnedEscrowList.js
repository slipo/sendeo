import React, { Component } from 'react'

import { wallet, u } from '@cityofzion/neon-js'

import { SENDER_HISTORY_PREFIX, GAS_ASSET_ID, NEO_ASSET_ID } from '../lib/const'
import { neonGetTxHistory, neonGetTxInfo, neonGetTxAssets } from '../lib/storage'
import { neonJsClaim } from '../lib/invocations'

class OwnedEscrowList extends Component {
  state = {
    ownedEscrowScriptHashes: null,
    errorMsg: '',
    isLoading: true,
    previousSends: [],
  }

  componentDidMount() {
    const { address, contractScriptHash, net } = this.props
    this.getSentTransactions(address, contractScriptHash, net)
  }

  getSentTransactions = (address, contractScriptHash, net) => {
    neonGetTxHistory(SENDER_HISTORY_PREFIX, address, contractScriptHash, net)
      .then((results) => {
        results.map(txId => {
          this.getTxInfo(txId, contractScriptHash, net)
        })
      })
      .catch((e) => {
        this.setState({
          errorMsg: e.message,
          isLoading: false,
        })
        console.log(e)
      })
  }

  rescindPreviousSend = (txId) => {
    const { address, contractScriptHash, net } = this.props

    const tmpAccount = new wallet.Account()
    neonJsClaim(address, tmpAccount.WIF, net, contractScriptHash, txId)
      .then((res) => {
        console.log('res', res)
      })
      .catch((e) => {
        console.log('error', e)
      })
  }

  getTxInfo = (txId, contractScriptHash, net) => {
    neonGetTxInfo(txId, contractScriptHash, net)
      .then((result) => {
        return neonGetTxAssets(u.reverseHex(txId), contractScriptHash, net)
          .then((assets) => {
            let newPreviousSends = this.state.previousSends
            newPreviousSends.push({
              txId: u.reverseHex(txId),
              note: result.note,
              created: result.created,
              spent: result.spent,
              canRescind: result.canRescind,
              assets: assets,
            })

            this.setState({ previousSends: newPreviousSends, isLoading: false })
          })
      })
      .catch((e) => {
        console.error(e)
      })
  }

  renderPreviousSendRows() {
    const { previousSends } = this.state
    const { contractScriptHash, net } = this.props

    let rows = []

    if (previousSends) {
      previousSends.map(previousSend => {
        rows.push(
          <tr key={ previousSend.txId }>
            <td style={ { 'maxWidth': '100px', 'overflow': 'hidden' } }>{previousSend.txId}</td>
            <td>
              { previousSend.assets[GAS_ASSET_ID] > 0 && <div>{ previousSend.assets[GAS_ASSET_ID] } GAS</div>}
              { previousSend.assets[NEO_ASSET_ID] > 0 && <div>{ previousSend.assets[NEO_ASSET_ID] } NEO</div>}
            </td>
            <td>{previousSend.note}</td>
            <td>{previousSend.created}</td>
            <td>{ previousSend.spent ? <div>Already claimed</div> : previousSend.canRescind ? <a href='#' onClick={ () => { this.rescindPreviousSend(previousSend.txId) } }>Rescind</a> : <span>Not Yet</span> }</td>
          </tr>
        )
      })
    }

    return rows
  }

  render() {
    const { isLoading } = this.state

    return (
      <table className='table table-striped table-hover'>
        <thead>
          <tr>
            <th>TxID</th>
            <th>Amount</th>
            <th>Note</th>
            <th>Created</th>
            <th>Rescind</th>
          </tr>
        </thead>
        <tbody>
          { isLoading &&
            <tr>
              <td colSpan='5' className='text-center primary'>
                <i className='fa fa-fw fa-spin fa-spinner' /> Checking wallet for previous sends...
              </td>
            </tr>
          }

          { !isLoading && this.renderPreviousSendRows() }
        </tbody>
      </table>
    )
  }
}

export default OwnedEscrowList
