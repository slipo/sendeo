import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap'
import { wallet } from '@cityofzion/neon-js'
import Modal from 'react-modal'
import ReceivedSuccessModal from './ReceivedSuccessModal/ReceivedSuccessModal'
import { neonJsClaim } from '../../../lib/neonWrappers'
import { net, contractScriptHash } from '../../../AppConfig'

import './ClaimForm.css'

class ClaimForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      destinationAddress: '',
      destinationAddressIsValid: false,
      status: '',
      errorMsg: '',
      assets: null,
    }
  }

  isValidDestinationAddress = (event) => {
    this.setState({
      destinationAddress: event.target.value,
    })

    if (wallet.isAddress(event.target.value)) {
      if (this.state.destinationAddressIsValid !== true) {
        this.setState({
          destinationAddressIsValid: true,
        })
      }
    }

    if (this.state.destinationAddressIsValid !== false) {
      this.setState({
        destinationAddressIsValid: false,
      })
    }
  };

  sendAssets = () => {
    this.setState({
      txId: '',
      status: 'loading',
      errorMsg: '',
    })

    const { destinationAddress } = this.state
    const { escrowPrivateKey, receivedTxId } = this.props

    neonJsClaim(destinationAddress, escrowPrivateKey, net, contractScriptHash, receivedTxId)
      .then((res) => {
        if (res.result === true) {
          this.setState({
            txId: res.txid,
            status: 'success',
            errorMsg: '',
          })
        } else {
          this.setState({
            txId: '',
            status: 'error',
            errorMsg: 'NEO node returned false, but no error message.',
          })
        }

        return res
      })
      .catch((e) => {
        this.setState({
          txId: '',
          status: 'error',
          errorMsg: e.message,
        })
      })
  }

  handleInputFocus = (event) => {
    event.target.select()
  }

  render() {
    const { txId, destinationAddress, destinationAddressIsValid } = this.state

    const {
      assetReceived,
      amountReceived,
    } = this.props

    return (
      <div>
        <form>
          <FormGroup
            controlId='claimForm'
            className='claim-form-input-container'
          >
            <FormControl
              type='text'
              value={ destinationAddress }
              placeholder='Public Address'
              onChange={ (event) => this.isValidDestinationAddress(event) }
              bsSize='large'
              autoFocus
              onFocus={ this.handleInputFocus }
            />
            { !destinationAddressIsValid && <HelpBlock className='text-danger'>Please use a valid NEO address.</HelpBlock> }
          </FormGroup>

          <div className='button-container'>
            <Button
              bsStyle='primary'
              bsSize='large'
              block
              disabled={ !destinationAddressIsValid || this.state.status === 'loading' }
              onClick={ () => this.sendAssets() }
            >Claim Your { amountReceived } { assetReceived }</Button>
            <p className='text-center terms-text'><small>By using Sendeo, you acknowledge that you are using beta software, at your own risk.</small></p>
          </div>
        </form>

        <Modal isOpen={ this.state.status === 'success' } >
          { txId &&
            <ReceivedSuccessModal
              txId={ txId }
              assetReceived={ assetReceived }
              amountReceived={ amountReceived }
            />
          }
        </Modal>
      </div>
    )
  }
}

ClaimForm.propTypes = {
  escrowPrivateKey: PropTypes.string.isRequired,
  receivedTxId: PropTypes.string.isRequired,
  assetReceived: PropTypes.string.isRequired,
  amountReceived: PropTypes.number.isRequired,
}

Modal.setAppElement('#root')

export default ClaimForm
