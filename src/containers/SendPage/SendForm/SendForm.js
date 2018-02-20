import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap'
import Modal from 'react-modal'
import * as qs from 'query-string'
import { wallet, u } from '@cityofzion/neon-js'

import SuccessModal from './SuccessModal/SuccessModal'
import './SendForm.css'
import { contractScriptHash } from '../../../AppConfig'

class SendForm extends Component {
  state = {
    amountToSend: 1,
    amountToSendIsValid: true,
    messageValue: '',
    assetType: 'NEO',
    extensionState: {
      neoLinkConnected: null,
      isLoggedIn: null,
      address: null,
    },
    sourcePrivateKey: '',
    escrowPrivatekey: '',
    txId: '',
    depositSuccess: false,
  }

  componentDidMount() {
    const urlQuery = qs.parse(window.location.search)
    if (urlQuery.asset) {
      this.setState({ assetType: urlQuery.asset.toUpperCase() })
      window.history.replaceState(null, null, window.location.pathname)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const urlQuery = qs.parse(window.location.search)
    if (urlQuery.asset && this.state.assetType !== urlQuery.asset.toUpperCase()) {
      this.setState({ assetType: urlQuery.asset.toUpperCase() })
      window.history.replaceState(null, null, window.location.pathname)
    }
  }

  isInt(value) {
    let x
    if (isNaN(value)) {
      return false
    }
    x = parseFloat(value)
    return (x | 0) === x
  }

  isValidAmountToSend = () => {
    const { amountToSend, assetType, amountToSendIsValid } = this.state

    if (assetType === 'GAS' && (amountToSend === 0 || !(!isNaN(parseFloat(amountToSend)) && isFinite(amountToSend)))) {
      if (amountToSendIsValid !== false) {
        this.setState({ amountToSendIsValid: false })
      }

      return 'error'
    } else if (this.state.assetType === 'NEO' && !this.isInt(amountToSend)) {
      if (amountToSendIsValid !== false) {
        this.setState({ amountToSendIsValid: false })
      }

      return 'error'
    } else {
      if (amountToSendIsValid !== true) {
        this.setState({ amountToSendIsValid: true })
      }

      return null
    }
  }

  handleChangeToAmount = (e) => {
    this.setState({ amountToSend: e.target.value })
  }

  initiateDeposit = () => {
    const escrowAccount = new wallet.Account()
    this.setState({ escrowPrivateKey: escrowAccount.WIF })

    let message = this.state.messageValue
    if (!message) {
      message = ' '
    }

    window.postMessage({
      type: 'NEOLINK_SEND_INVOKE',
      text: {
        scriptHash: contractScriptHash,
        operation: 'deposit',
        arg1: u.reverseHex(escrowAccount.scriptHash),
        arg2: u.str2hexstring(message),
        assetType: this.state.assetType,
        assetAmount: this.state.amountToSend,
      },
    }, '*')

    // todo: remove on unmount
    window.addEventListener('message', this.handleNeolinkResponse, false)
  }

  handleNeolinkResponse = (event) => {
    console.log('NEOLink Response: ', event)
    if (event.data && event.data.type === 'NEOLINK_SEND_INVOKE_RESPONSE') {
      this.setState({
        txId: event.data.result.txid,
        depositSuccess: true,
      })
    }
  }

  handleInputFocus = (event) => {
    event.target.select()
  }

  setAssetType(assetType) {
    this.setState({ assetType })
  }

  updateMessageValue(event) {
    this.setState({
      messageValue: event.target.value,
    })
  }

  componentWillUnmount() {
    clearTimeout(this.handleNeolinkResponse)
    window.removeEventListener('message', this.handleNeolinkResponse)
  }

  handleAcceptanceChange(event) {
    this.setState({
      acceptance: !this.state.acceptance,
    })
  }

  render() {
    const {
      txId,
      assetType,
      amountToSend,
      amountToSendIsValid,
      messageValue,
      depositSuccess,
      escrowPrivateKey,
      acceptance,
    } = this.state

    const {
      neoLinkConnected,
      isLoggedIn,
    } = this.props

    return (
      <div>
        <form>
          { neoLinkConnected !== null && !neoLinkConnected &&
            <div className='alert alert-danger'>
              <h4>NeoLink Not Installed</h4>
              <p>Please visit <a href='https://github.com/CityOfZion/NeoLink' target='_blank' rel='noopener noreferrer'>https://github.com/CityOfZion/NeoLink</a> and download the Chrome Extension and then refresh this page.</p>
            </div>
          }
          { neoLinkConnected !== null && neoLinkConnected && !isLoggedIn &&
            <div className='alert alert-info'>
              <h4>NeoLink Not Logged In</h4>
              <p>Please login using your NeoLink browser extension and then refresh this page.</p>
            </div>
          }
          <FormGroup
            controlId='sendForm'
            validationState={ this.isValidAmountToSend() }
            style={ { 'minHeight': '100px' } }
            className='quantity-field'
          >
            <FormControl
              type='text'
              value={ amountToSend }
              placeholder=''
              autoFocus
              onChange={ this.handleChangeToAmount }
              bsSize='large'
              className='text-right'
              onFocus={ this.handleInputFocus }
            />
            <FormControl.Feedback />
            { assetType === 'NEO' && <HelpBlock>Only whole numbers of NEO can be sent.</HelpBlock> }
          </FormGroup>

          <div className='message-field'>
            <FormGroup
              controlId='sendFormMessage'
            >
              <FormControl
                type='text'
                placeholder='Attach a message? (optional)'
                bsSize='large'
                className='text-right'
                value={ messageValue } onChange={ evt => this.updateMessageValue(evt) }
              />
            </FormGroup>
          </div>

          <ButtonGroup justified>
            <Button
              href='#'
              onClick={ () => this.setAssetType('NEO') }
              active={ assetType === 'NEO' }
              disabled={ !neoLinkConnected || !isLoggedIn }
            >Send NEO</Button>
            <Button
              href='#'
              onClick={ () => this.setAssetType('GAS') }
              active={ assetType === 'GAS' }
              disabled={ !neoLinkConnected || !isLoggedIn }
            >Send GAS</Button>
          </ButtonGroup>

          <hr />

          <div className='button-container'>
            <Button
              bsStyle='success'
              bsSize='large'
              block
              disabled={ !amountToSendIsValid || !neoLinkConnected || !isLoggedIn || !acceptance }
              onClick={ () => this.initiateDeposit() }
            >Deposit Now</Button>

            <div className='checkbox text-left'>
              <label>
                <input type='checkbox' name='acceptance' onClick={ this.handleAcceptanceChange.bind(this) } />
                <small>By using Sendeo, you accept that you are using beta software, at your own risk.</small>
              </label>
            </div>
          </div>

          <Modal isOpen={ depositSuccess } >
            { escrowPrivateKey &&
              <SuccessModal
                txId={ txId }
                assetType={ assetType }
                amountSent={ amountToSend }
                escrowPrivateKey={ escrowPrivateKey }
              />
            }
          </Modal>
        </form>
      </div>
    )
  }
}

SendForm.propTypes = {
  neoLinkConnected: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
}

Modal.setAppElement('#root')

export default SendForm
