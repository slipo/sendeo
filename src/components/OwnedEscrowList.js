import React, { Component } from 'react'

import { neonGetOwnedEscrowScriptHashes } from '../lib/storage'

class OwnedEscrowList extends Component {
  state = {
    ownedEscrowScriptHashes: null,
    errorMsg: '',
    isLoading: true,
  }

  componentDidMount() {
    const { address, contractScriptHash, net } = this.props
    this.getOwnedEscrowScriptHashes(address, contractScriptHash, net)
  }

  getOwnedEscrowScriptHashes = (address, contractScriptHash, net) => {
    neonGetOwnedEscrowScriptHashes(address, contractScriptHash, net)
      .then((results) => {
        console.log('got some!', results)
        this.setState({
          ownedEscrowScriptHashes: results,
          errorMsg: '',
          isLoading: false,
        })
        this.props.setPreviousSendsState(results)
      })
      .catch((e) => {
        this.setState({
          ownedEscrowScriptHashes: null,
          errorMsg: e.message,
          isLoading: false,
        })
        console.log(e)
      })
  }

  rescindPreviousSend = (previousScriptHash) => {
    console.log('rescinding ', previousScriptHash)
  }

  renderPreviousSendRows() {
    const { ownedEscrowScriptHashes } = this.state

    let rows = []

    ownedEscrowScriptHashes.map(ownedScriptHash => {
      let dateOffset = (24 * 60 * 60 * 1000) * 7
      let sevenDaysAgo = new Date()
      sevenDaysAgo.setTime(sevenDaysAgo.getTime() - dateOffset)

      let canRescind = ownedScriptHash.created < sevenDaysAgo
      rows.push(
        <tr key={ ownedScriptHash.id }>
          <td>{ownedScriptHash.id}</td>
          <td>{ownedScriptHash.type}</td>
          <td>{ownedScriptHash.amount}</td>
          <td>{ownedScriptHash.created}</td>
          <td>{ canRescind ? <a href='#' onClick={ this.rescindPreviousSend(ownedScriptHash) }>Rescind</a> : <span>Not Yet</span> }</td>
        </tr>
      )
    })

    return rows
  }

  render() {
    const { isLoading } = this.state

    return (
      <table className='table table-striped table-hover'>
        <thead>
          <tr>
            <th>TxID</th>
            <th>Type</th>
            <th>Amount</th>
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
