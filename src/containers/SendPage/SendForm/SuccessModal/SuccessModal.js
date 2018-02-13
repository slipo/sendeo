import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import TxId from '../../../../components/TxId/TxId'
import './SuccessModal.css'

class SuccessModal extends Component {
  render() {
    const {
      txId,
      assetType,
      amountSent,
      escrowPrivateKey,
    } = this.props

    return (
      <div className='modal-outer success-container'>
        <div className='modal-inner'>
          <h2 className='lead text-center'>Deposit Successful!</h2>
          <hr />

          <dl className='dl-horizontal'>
            <dt className='address-link'>Tx ID:</dt>
            <dd className='text-left'><TxId txId={ txId } /></dd>
            <dt>Asset:</dt>
            <dd className='text-left'>{ assetType }</dd>
            <dt>Quantity:</dt>
            <dd className='text-left'>{ amountSent }</dd>
          </dl>
          <hr />

          <p className='lead text-center'>You can share the URL below with anyone you would like to be able to claim the assets above.</p>
          <pre className='text-center'>https://sendeo.com/claim/{ escrowPrivateKey }/{ txId }</pre>
          <hr />

          <p className='text-center small'>Whoa! We will only show you this once, so keep it safe. In one week's time, if this deposit hasn't been claimed, you can come back here and get it.</p>

          <p className='text-center'><a href={ `/send?asset=${assetType}` }>Click here to send some more.</a></p>
        </div>
      </div>
    )
  }
}

SuccessModal.propTypes = {
  txId: PropTypes.string.isRequired,
  assetType: PropTypes.string.isRequired,
  amountSent: PropTypes.number.isRequired,
  escrowPrivateKey: PropTypes.string.isRequired,
}

export default SuccessModal
