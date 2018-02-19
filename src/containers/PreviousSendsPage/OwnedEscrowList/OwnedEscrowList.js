import React, { Component } from 'react'
import PropTypes from 'prop-types'

import OwnedEscrowListRow from './OwnedEscrowListRow/OwnedEscrowListRow'
import { SENDER_HISTORY_PREFIX } from '../../../lib/const'
import { neonGetTxHistory } from '../../../lib/neonWrappers'

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
        this.setState({
          previousSends: results,
          isLoading: false,
        })
      })
      .catch((e) => {
        this.setState({
          errorMsg: e.message,
          isLoading: false,
        })
      })
  }

  renderPreviousSendRows() {
    const { previousSends } = this.state
    const { address, contractScriptHash, net } = this.props

    let rows = []

    if (previousSends) {
      previousSends.map(txId => {
        rows.push(
          <OwnedEscrowListRow txId={ txId } address={ address } contractScriptHash={ contractScriptHash } net={ net } />
        )
        return true
      })
    }

    return rows
  }

  render() {
    const { isLoading, errorMsg } = this.state

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
          { errorMsg !== '' &&
            <tr>
              <td colSpan='5' className='text-center primary'>
                ERROR: { errorMsg }
              </td>
            </tr>
          }
          { isLoading &&
            <tr>
              <td colSpan='5' className='text-center primary'>
                <i className='fa fa-fw fa-spin fa-spinner' /> Checking wallet for previous sends...
              </td>
            </tr>
          }

          { errorMsg === '' && !isLoading && this.renderPreviousSendRows() }
        </tbody>
      </table>
    )
  }
}

OwnedEscrowList.propTypes = {
  contractScriptHash: PropTypes.string,
  net: PropTypes.string,
  address: PropTypes.string,
}

export default OwnedEscrowList
