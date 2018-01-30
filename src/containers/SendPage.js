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
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor'
import * as qs from 'query-string'

import CheckLoggedIn from '../components/CheckLoggedIn'
import './SendPage.css'

configureAnchors({ offset: -80, scrollDuration: 500 })

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
      this.setState({ assetType: urlQuery.asset.toUpperCase() })
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
        <header className='header' id='header'>
          <div className='container'>
            <figure className='animated fadeInDown delay-07s'>
              <iframe width='560' height='315' src='https://www.youtube.com/embed/8PYKOo_jgJo?rel=0&amp;controls=0' frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen />
            </figure>
            <h1 className='animated fadeInDown delay-07s'>The easiest way to share NEO and GAS with others</h1>
            <ul className='we-create animated fadeInUp delay-1s'>
              <li>It only takes a minute.</li>
            </ul>
            <a className='link animated fadeInUp delay-1s servicelink' href='#get-started'>Get Started</a>
          </div>
        </header>

        <Sticky>
          <nav className='main-nav-outer'>
            <div className='container'>
              <ul className='main-nav'>
                <li><Link to='/?asset=neo#get-started'>Send NEO</Link></li>
                <li><Link to='/?asset=gas#get-started'>Send GAS</Link></li>
                <li><Link to='/previousSends'>Previous Sends</Link></li>
                <li><Link to='/about'>About</Link></li>
              </ul>
              <a className='res-nav_click' href='#'>
                <i className='fa-bars' />
              </a>
              <CheckLoggedIn setExtensionState={ this.setExtensionState } extensionState={ extensionState } />
            </div>
          </nav>
        </Sticky>

        <section className='main-section'>
          <div className='container'>
            <ScrollableAnchor id={ 'get-started' } offset={ '400' }>
              <h2>How it Works</h2>
            </ScrollableAnchor>
            <h6>Send NEO is a smart contract that serves as a temporary escrow account that can be claimed by others.</h6>
            <div className='row'>
              <div className='col-sm-7 wow fadeInLeft delay-05s'>
                <div className='service-list'>
                  <div className='service-list-col1'>
                    <i className='fa-paper-plane' />
                  </div>
                  <div className='service-list-col2'>
                    <h3>1. Send NEO or GAS using NeoLink</h3>
                    <p>Be sure NeoLink is unlocked and choose the amount of NEO or GAS you want to send.</p>
                  </div>
                </div>
                <div className='service-list'>
                  <div className='service-list-col1'>
                    <i className='fa-bullhorn' />
                  </div>
                  <div className='service-list-col2'>
                    <h3>2. Share the secret URL with the recipient</h3>
                    <p>Once the deposit has been made, we will give you a URL that will be able to unlock the assets.</p>
                  </div>
                </div>
                <div className='service-list'>
                  <div className='service-list-col1'>
                    <i className='fa-address-card-o' />
                  </div>
                  <div className='service-list-col2'>
                    <h3>3. The recipient says where to send it</h3>
                    <p>They provide the smart contract with a wallet address and claim their gift.</p>
                  </div>
                </div>
                <div className='service-list'>
                  <div className='service-list-col1'>
                    <i className='fa-money' />
                  </div>
                  <div className='service-list-col2'>
                    <h3>4. Profit</h3>
                    <p>It really is that easy.</p>
                  </div>
                </div>
              </div>
              <figure className='col-sm-5 text-right wow fadeInUp delay-02s'>
                <div className='panel panel-default'>
                  <div className='panel-heading'>
                    <h3 className='panel-title'>How much would you like to send?</h3>
                  </div>
                  <div className='panel-body'>
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
                          disabled={ !amountToSendIsValid || !extensionState.neoLinkConnected || !extensionState.isLoggedIn }
                        >Send NEO</Button>
                        <Button
                          href='#'
                          onClick={ () => this.setAssetType('GAS') }
                          active={ assetType === 'GAS' }
                          disabled={ !amountToSendIsValid || !extensionState.neoLinkConnected || !extensionState.isLoggedIn }
                        >Send GAS</Button>
                      </ButtonGroup>

                      <hr />

                      <div className='button-container'>
                        <Button
                          bsStyle='primary'
                          bsSize='large'
                          block
                          disabled={ !amountToSendIsValid || !extensionState.neoLinkConnected || !extensionState.isLoggedIn }
                          onClick={ () => this.initiateDeposit() }
                        >Deposit Now</Button>
                        <p className='text-center terms-text'><small>By clicking the submit button below, you are acknowledging agreement that you will be
                        sending your own assets blah blah blah.</small></p>
                      </div>

                      { depositSuccess &&
                        <div className='alert alert-success success-container text-center'>
                          <p className='lead'>Deposit Successful!</p>
                          <hr />

                          <dl className='dl-horizontal'>
                            <dt className='address-link'>Tx ID:</dt>
                            <dd className='text-left'><a href='#'>{ txId }</a></dd>
                            <dt>Asset:</dt>
                            <dd className='text-left'><a href='#'>{ assetType }</a></dd>
                            <dt>Quantity:</dt>
                            <dd className='text-left'><a href='#'>{ amountToSend }</a></dd>
                          </dl>
                          <hr />

                          <p>You can share the URL below with anyone you would like to be able to claim the assets above.</p>
                          <pre>https://sendneo.com/claim/{ this.state.escrowPrivateKey }</pre>

                          <p className='small'>Don't lose this, you can't get it back. But just in case, in one week's time, if this deposit hasn't been claimed, we will send it back to you.</p>

                        </div>
                      }
                    </form>
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </section>

        <pre>
          <code>
            { JSON.stringify(this.state, null, 2) }
          </code>
        </pre>

      </div>
    )
  }
}

export default SendPage
