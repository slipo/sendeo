import React, { Component } from 'react'

import { u } from '@cityofzion/neon-js'

import { SENDER_HISTORY_PREFIX, GAS_ASSET_ID, NEO_ASSET_ID } from '../lib/const'
import { neonGetTxHistory, neonGetTxInfo, neonGetTxAssets } from '../lib/storage'

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
        console.log('got some!', results)
        results.map(txId => {
          console.log('getting tx info for ', txId)
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

  handleRescindGiftResponse = (event) => {
    if (event.data && event.data.type === 'NEOLINK_SEND_INVOKE_RESPONSE') {
      this.setState({
        txId: event.data.result.txid,
        success: true,
      })

      window.removeEventListener('click', this.handleRescindGiftResponse)
    }
  }

  rescindPreviousSend = (previousScriptHash) => {
    const { contractScriptHash } = this.props

    window.postMessage({
      type: 'NEOLINK_SEND_INVOKE',
      text: {
        scriptHash: contractScriptHash,
        operation: 'rescindGift',
        arg1: previousScriptHash,
        arg2: '',
        assetType: 'GAS',
        assetAmount: 0.00000001, // We need to send a drop of GAS to make it go through. todo add this to NeoLink.
      },
    }, '*')

    window.addEventListener('message', this.handleRescindGiftResponse, false)
    console.log('rescinding ', previousScriptHash)
  }

  getTxInfo = (txId, contractScriptHash, net) => {
    console.log(txId)
    neonGetTxInfo(txId, contractScriptHash, net)
      .then((result) => {
        console.log('got some transaction info', result)
        return neonGetTxAssets(u.reverseHex(txId), contractScriptHash, net)
          .then((assets) => {
            let newPreviousSends = this.state.previousSends
            newPreviousSends.push({
              txId: txId,
              note: result.note,
              created: result.created,
              canRescind: result.canRescind,
              assets: assets,
            })

            console.log('adding', newPreviousSends)
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
            <td>{previousSend.amount}</td>
            <td>{previousSend.note}</td>
            <td>{previousSend.created}</td>
            <td>{ previousSend.canRescind ? <a href='#' onClick={ () => { this.rescindPreviousSend(previousSend.scriptHash) } }>Rescind</a> : <span>Not Yet</span> }</td>
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
              <td colSpan='4' className='text-center primary'>
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
