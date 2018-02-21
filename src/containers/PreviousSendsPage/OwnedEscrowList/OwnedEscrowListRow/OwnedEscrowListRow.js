import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { u } from '@cityofzion/neon-js'

import RescindButton from './RescindButton/RescindButton'
import TxId from '../../../../components/TxId/TxId'
import { GAS_ASSET_ID, NEO_ASSET_ID } from '../../../../lib/const'
import { neonGetTxInfo, neonGetTxAssets } from '../../../../lib/neonWrappers'

class OwnedEscrowListRow extends Component {
  state = {
    ownedEscrowScriptHashes: null,
    errorMsg: '',
    isLoading: true,
    previousSends: [],
  }

  componentDidMount() {
    const { contractScriptHash, net, txId } = this.props

    neonGetTxInfo(txId, contractScriptHash, net)
      .then((result) => {
        return neonGetTxAssets(u.reverseHex(txId), contractScriptHash, net)
          .then((assets) => {
            this.setState({
              note: result.note,
              created: result.created,
              spent: result.spent,
              canRescind: result.canRescind,
              assets: assets,
              isLoading: false,
            })
          })
      })
      .catch((e) => {
        this.setState({
          errorMsg: e.message,
          isLoading: false,
        })
      })
  }

  render() {
    const { note, created, spent, canRescind, assets, isLoading, errorMsg } = this.state
    const { address, contractScriptHash, net, txId } = this.props

    let rescindColumn
    if (!canRescind) {
      rescindColumn = <div><i>Unavailable</i></div>
    } else {
      rescindColumn = <RescindButton contractScriptHash={ contractScriptHash } net={ net } address={ address } txId={ u.reverseHex(txId) } />
    }

    if (errorMsg !== '') {
      return (
        <tr>
          <td colSpan='5' className='text-center danger'>
            ERROR: { errorMsg }
          </td>
        </tr>
      )
    } else if (isLoading) {
      return (
        <tr>
          <td colSpan='5' className='text-center'>
            <i className='fa fa-fw fa-spin fa-spinner' /> Checking wallet for previous sends...
          </td>
        </tr>
      )
    } else {
      return (
        <tr key={ txId }>
          <td style={ { 'maxWidth': '125px' } }><TxId txId={ u.reverseHex(txId) } /></td>
          <td style={ { 'maxWidth': '125px' } }>{created}</td>
          <td>
            { assets[GAS_ASSET_ID] > 0 && <div>{ assets[GAS_ASSET_ID] } GAS</div>}
            { assets[NEO_ASSET_ID] > 0 && <div>{ assets[NEO_ASSET_ID] } NEO</div>}
          </td>
          <td style={ { 'width': '200px' } }>{note}</td>
          <td className='text-right'>{rescindColumn}</td>
        </tr>
      )
    }
  }
}

OwnedEscrowListRow.propTypes = {
  contractScriptHash: PropTypes.string,
  net: PropTypes.string,
  address: PropTypes.string,
  txId: PropTypes.string,
}

export default OwnedEscrowListRow
