import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap'
import { wallet, u } from '@cityofzion/neon-js'
import Sticky from 'react-stickynode'
import * as qs from 'query-string'

import Header from '../../components/Header/Header'
import CheckLoggedIn from '../../components/CheckLoggedIn/CheckLoggedIn'
import './SendPage.css'

import neoLogo from '../../images/neo-logo.svg'
import secretUrlIcon from '../../images/secret-url.svg'
import pointingIcon from '../../images/pointing.svg'

class SendPage extends Component {
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
      this.setAssetType(urlQuery.asset.toUpperCase())
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const urlQuery = qs.parse(window.location.search)
    if (urlQuery.asset && this.state.assetType !== urlQuery.asset.toUpperCase()) {
      this.setAssetType(urlQuery.asset.toUpperCase())
    }
  }

  setExtensionState = (neoLinkConnected, isLoggedIn, address) => {
    this.setState({ extensionState: { neoLinkConnected, isLoggedIn, address } })
  }

  setAssetType = (asset) => {
    this.setState({ assetType: asset })
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
    const { contractScriptHash } = this.props
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

  componentWillUnmount() {
    clearTimeout(this.handleNeolinkResponse)
    window.removeEventListener('message', this.handleNeolinkResponse)
  }

  render() {
    const {
      txId,
      extensionState,
      assetType,
      amountToSend,
      amountToSendIsValid,
      depositSuccess,
      privateKey,
    } = this.state

    const { contractScriptHash, net } = this.props

    return (
      <div>
        <span>
          <Header />
          <CheckLoggedIn setExtensionState={ this.setExtensionState } extensionState={ extensionState } />
        </span>

        <section className='main-section'>
          <div className='container'>
            <h2 className='page-title'>Sendeo is a smart contract that serves as a temporary escrow account that can be claimed by others.</h2>
            <div className='row'>
              <div className='col-sm-7 wow fadeInLeft delay-05s left-side'>
                <div className='service-list'>
                  <div className='service-list-col1'>
                    <img src={ neoLogo } />
                  </div>
                  <div className='service-list-col2'>
                    <h3>First, login to <a href='https://github.com/CityOfZion/NeoLink' target='_blank'>NeoLink</a> and Send some { assetType }</h3>
                    <p>NeoLink is a browser extension that lets you interact with the NEO blockchain.</p>
                  </div>
                </div>
                <hr />
                <div className='service-list reverse'>
                  <div className='service-list-col1'>
                    <h3>Pick your asset and how much and click send! Boom!</h3>
                    <p>You then get a secret URL that you can share with anyone to claim the { assetType }.</p>
                  </div>
                  <div className='service-list-col2'>
                    <img src={ secretUrlIcon } />
                  </div>
                </div>
                <hr />
                <div className='service-list'>
                  <div className='service-list-col1 smaller-image'>
                    <img src={ pointingIcon } />
                  </div>
                  <div className='service-list-col2'>
                    <h3>Your recipient clicks the link and tells Sendeo where to send the { assetType }.</h3>
                    <p>If you don't have a wallet yet, don't worry. We got you covered with all the info you need.</p>
                  </div>
                </div>
              </div>
              <figure className='col-sm-5 text-right wow fadeInUp delay-02s form-container'>
                <h1>So, how much you sending?</h1>
                <form>
                  <FormGroup
                    controlId='sendForm'
                    validationState={ this.isValidAmountToSend() }
                    style={ { 'minHeight': '100px' } }
                  >
                    <FormControl
                      type='text'
                      value={ amountToSend }
                      placeholder=''
                      autofocus='true'
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
                      disabled={ !extensionState.neoLinkConnected || !extensionState.isLoggedIn }
                    >Send NEO</Button>
                    <Button
                      href='#'
                      onClick={ () => this.setAssetType('GAS') }
                      active={ assetType === 'GAS' }
                      disabled={ !extensionState.neoLinkConnected || !extensionState.isLoggedIn }
                    >Send GAS</Button>
                  </ButtonGroup>

                  <hr />

                  <div className='button-container'>
                    <Button
                      bsStyle='success'
                      bsSize='large'
                      block
                      disabled={ !amountToSendIsValid || !extensionState.neoLinkConnected || !extensionState.isLoggedIn }
                      onClick={ () => this.initiateDeposit() }
                    >Deposit Now</Button>
                    <p className='text-center terms-text'><small>By using Sendeo, you acknowledge that you are using beta software, at your own risk.</small></p>
                  </div>
                </form>
              </figure>
            </div>
          </div>
        </section>

        { depositSuccess &&
          <div className='modal-outer success-container'>
            <div className='modal-inner'>
              <h2 className='lead text-center'>Deposit Successful!</h2>
              <hr />

              <dl className='dl-horizontal'>
                <dt className='address-link'>Tx ID:</dt>
                <dd className='text-left'><a href='#'><div className='tx-container'>{ txId }</div></a></dd>
                <dt>Asset:</dt>
                <dd className='text-left'><a href='#'>{ assetType }</a></dd>
                <dt>Quantity:</dt>
                <dd className='text-left'><a href='#'>{ amountToSend }</a></dd>
              </dl>
              <hr />

              <p className='lead text-center'>You can share the URL below with anyone you would like to be able to claim the assets above.</p>
              <pre className='text-center'>https://sendeo.com/claim/{ this.state.escrowPrivateKey }</pre>
              <hr />

              <p className='text-center small'>Don't lose this, you can't get it back. But just in case, in one week's time, if this deposit hasn't been claimed, you can go get it back.</p>

              <p className='text-center'><Link to={ `/send?asset=${assetType}` }>Click here to send some more.</Link></p>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default SendPage
