import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import TxId from '../../../../components/TxId/TxId'
import { sendeoBaseUrl } from '../../../../AppConfig'
import './SuccessModal.css'

class SuccessModal extends Component {
  state = {
    copied: false,
  }

  selectUrl(event) {
    event.target.select()
  }

  onCopy() {
    this.setState({ copied: true })

    setTimeout(() => {
      this.setState({ copied: false })
    }, 5000)
  }

  render() {
    const {
      txId,
      assetType,
      amountSent,
      escrowPrivateKey,
      message,
    } = this.props

    const {
      copied,
    } = this.state

    const claimUrl = `${sendeoBaseUrl}claim/${escrowPrivateKey}/${txId}`

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
            { message &&
              <span>
                <dt>Message:</dt>
                <dd className='text-left'>{ message }</dd>
              </span>
            }
          </dl>
          <hr />

          <p className='lead text-center'>You can share the URL below with anyone you would like to be able to claim the assets above.</p>

          <div className='input-group'>
            <input
              type='text'
              className='form-control'
              onClick={ this.selectUrl.bind(this) }
              readOnly
              value={ claimUrl } />

            <CopyToClipboard text={ claimUrl } onCopy={ () => this.onCopy() } >
              <span className='input-group-addon'>
                <i className='fa fa-fw fa-clipboard' />
              </span>
            </CopyToClipboard>
          </div>
          { copied && <div className='text-right'>Copied to Clipboard</div> }
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
  message: PropTypes.string,
  escrowPrivateKey: PropTypes.string.isRequired,
}

export default SuccessModal
