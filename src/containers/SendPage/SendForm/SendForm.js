import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap'
import * as qs from 'query-string'
import { wallet, u } from '@cityofzion/neon-js'

import SuccessModal from './SuccessModal/SuccessModal'
import './SendForm.css'
import { net, contractScriptHash } from '../../../AppConfig'

class SendForm extends Component {
  state = {
    amountToSend: 1,
    amountToSendIsValid: true,
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

    window.postMessage({
      type: 'NEOLINK_SEND_INVOKE',
      text: {
        scriptHash: contractScriptHash,
        operation: 'deposit',
        arg1: u.reverseHex(escrowAccount.scriptHash),
        arg2: u.str2hexstring('Awesome Note!'),
        assetType: this.state.assetType,
        assetAmount: this.state.amountToSend,
      },
    }, '*')

    // todo: remove on unmount
    window.addEventListener('message', this.handleNeolinkResponse, false)
  }

  handleNeolinkResponse = (event) => {
    console.log(event)
    if (event.data && event.data.type === 'NEOLINK_SEND_INVOKE_RESPONSE') {
      this.setState({
        txId: event.data.result.txid,
        depositSuccess: true,
      })
    }
  }

  setAssetType(assetType) {
    this.setState({ assetType })
  }

  componentWillUnmount() {
    clearTimeout(this.handleNeolinkResponse)
    window.removeEventListener('message', this.handleNeolinkResponse)
  }

  render() {
    const {
      txId,
      assetType,
      amountToSend,
      amountToSendIsValid,
      depositSuccess,
      escrowPrivateKey,
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
          >
            <FormControl
              type='text'
              value={ amountToSend }
              placeholder=''
              autoFocus
              onChange={ this.handleChangeToAmount }
              bsSize='large'
              className='text-right'
            />
            <FormControl.Feedback />
            { assetType === 'NEO' && <HelpBlock>Only whole numbers of NEO can be sent.</HelpBlock> }
          </FormGroup>

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
              disabled={ !amountToSendIsValid || !neoLinkConnected || !isLoggedIn }
              onClick={ () => this.initiateDeposit() }
            >Deposit Now</Button>
            <p className='text-center terms-text'><small>By using Sendeo, you acknowledge that you are using beta software, at your own risk.</small></p>
          </div>

          { depositSuccess &&
            <SuccessModal
              txId={ txId }
              assetType={ assetType }
              amountSent={ amountToSend }
              escrowPrivateKey={ escrowPrivateKey }
            />
          }
        </form>
      </div>
    )
  }
}

SendForm.propTypes = {
  neoLinkConnected: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
}

export default SendForm