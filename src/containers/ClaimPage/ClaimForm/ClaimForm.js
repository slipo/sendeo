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
      resultTxId: false,
      resultTxStatus: '',
    }
  }

  isValidDestinationAddress = (event) => {
    this.setState({
      destinationAddress: event.target.value,
      resultTxStatus: '',
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
      resultTxId: '',
      resultTxStatus: 'loading',
      errorMsg: '',
    })

    const { destinationAddress } = this.state
    const { escrowPrivateKey, receivedTxId } = this.props

    neonJsClaim(destinationAddress, escrowPrivateKey, net, contractScriptHash, receivedTxId)
      .then((res) => {
        if (res.result === true) {
          this.setState({
            resultTxId: res.txid,
            resultTxStatus: 'success',
          })
        } else {
          this.setState({
            resultTxStatus: 'error',
            errorMsg: 'NEO node returned false, but no error message.',
          })
          console.error('Error making claim but no error message')
        }

        return res
      })
      .catch((e) => {
        this.setState({
          status: 'error',
          errorMsg: e.message,
        })
        return console.error('Error making claim', e)
      })
  }

  handleInputFocus = (event) => {
    event.target.select()
  }

  render() {
    const {
      loading,
      resultTxId,
      resultTxStatus,
      destinationAddress,
      destinationAddressIsValid,
    } = this.state

    const {
      assetReceived,
      amountReceived,
      message,
    } = this.props

    return (
      <div>
        { !loading &&
          <span>
            <form>
              <FormGroup
                controlId='claimForm'
                className='claim-form-input-container'
              >
                <FormControl
                  type='text'
                  value={ destinationAddress }
                  placeholder='Public NEO Address'
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
                  disabled={ !destinationAddressIsValid || resultTxStatus === 'loading' }
                  onClick={ () => this.sendAssets() }
                >Claim Your { amountReceived } { assetReceived }</Button>
              </div>
            </form>

            { resultTxStatus === 'error' &&
              <div className='alert alert-danger text-center'>
                <h3 className='text-danger'><i className='fa fa-fw fa-exclamation' /> Whoops!</h3>
                <p>There was an error while trying to send the asset to your wallet.</p>
              </div>
            }

            <Modal isOpen={ resultTxStatus === 'success' } >
              { resultTxId &&
                <ReceivedSuccessModal
                  txId={ resultTxId }
                  assetReceived={ assetReceived }
                  amountReceived={ amountReceived }
                  claimMessage={ message }
                />
              }
            </Modal>
          </span>
        }
      </div>
    )
  }
}

ClaimForm.propTypes = {
  escrowPrivateKey: PropTypes.string.isRequired,
  receivedTxId: PropTypes.string.isRequired,
  assetReceived: PropTypes.string.isRequired,
  amountReceived: PropTypes.number.isRequired,
  message: PropTypes.string,
}

Modal.setAppElement('#root')

export default ClaimForm
