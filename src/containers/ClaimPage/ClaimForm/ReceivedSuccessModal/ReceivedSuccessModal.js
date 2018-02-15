import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TxId from '../../../../components/TxId/TxId'
import './ReceivedSuccessModal.css'

class ReceivedSuccessModal extends Component {
  render() {
    const {
      txId,
      assetReceived,
      amountReceived,
    } = this.props

    return (
      <div className='modal-outer success-container'>
        <div className='modal-inner'>
          <h2 className='lead text-center'>Congratulations! Transfer Successful!</h2>
          <hr />

          <h5>You can see the details of your transaction below.</h5>
          <dl className='dl-horizontal'>
            <dt className='address-link'>Tx ID:</dt>
            <dd className='text-left'><TxId txId={ txId } /></dd>
            <dt>Asset:</dt>
            <dd className='text-left'>{ assetReceived }</dd>
            <dt>Quantity:</dt>
            <dd className='text-left'>{ amountReceived }</dd>
          </dl>
          <hr />

          <p className='text-center'><a href={ `/send?asset=${assetReceived}` }>Now you got some, click here to send it to somebody else. :)</a></p>
        </div>
      </div>
    )
  }
}

ReceivedSuccessModal.propTypes = {
  txId: PropTypes.string.isRequired,
  amountReceived: PropTypes.number.isRequired,
  assetReceived: PropTypes.string.isRequired,
}

export default ReceivedSuccessModal
