import React, { Component } from 'react'
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Grid,
  HelpBlock,
} from 'react-bootstrap'
import Neon, { api, sc, sb, core, rpc, wallet, u, tx } from '@cityofzion/neon-js'
import Sticky from 'react-stickynode'
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor'

import CheckLoggedIn from '../components/CheckLoggedIn'

import './ClaimPage.css'

class ClaimPage extends Component {
  constructor(props) {
    super(props)

    this.isValidDestinationAddress = this.isValidDestinationAddress.bind(this)
    this.handleChangeToDestinationAddress = this.handleChangeToDestinationAddress.bind(this)
    this.sendAssets = this.sendAssets.bind(this)

    console.log(props)

    this.state = {
      destinationAddress: '',
      destinationAddressIsValid: false,
      extensionState: {
        neoLinkConnected: null,
        isLoggedIn: null,
        address: null,
      },
      net: 'http://35.192.230.39:5000/',
      contractScriptHash: '77730992315f984e7a3cf281c001e2c34b6d4982',
      escrowPrivateKey: props.match.params.key,
      txId: '',
      status: '',
      errorMsg: '',
    }
  }

  setExtensionState = (neoLinkConnected, isLoggedIn, address) => {
    this.setState({ extensionState: { neoLinkConnected, isLoggedIn, address } })
  }

  isValidDestinationAddress = () => {
    if (this.state.destinationAddress && this.state.destinationAddress.length > 0) {
      return 'success'
    }

    return 'error'
  };

  handleChangeToDestinationAddress = (event) => {
    this.setState({
      destinationAddress: event.target.value,
      destinationAddressIsValid: true,
    })
  };

  sendAssets = () => {
    this.setState({
      txId: '',
      status: 'loading',
      errorMsg: '',
    })

    const { escrowPrivateKey, contractScriptHash, net, destinationAddress } = this.state

    const escrowAccount = new wallet.Account(escrowPrivateKey)
    console.log(escrowAccount)
    const rpcEndpointPromise = api.neonDB.getRPCEndpoint(net)

    const contractAddr = wallet.getAddressFromScriptHash(contractScriptHash)
    const balancePromise = api.neonDB.getBalance(net, contractAddr)

    // todo, transfer all.
    const transferAmount = 0.00001

    // todo, check gas cost?
    const gasCost = 0

    let signedTx
    let endpt
    let balances
    let script

    return Promise.all([rpcEndpointPromise, balancePromise])
      .then((values) => {
        endpt = values[0]
        balances = values[1]

        const query = Neon.create.query({
          'method': 'getcontractstate',
          'params': [
            contractScriptHash,
          ],
        })

        return query.execute(endpt)
      })
      .then((contractState) => {
        console.log('contractState', contractState)
        script = contractState.result.script

        const intents = [
          {
            assetId: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
            value: transferAmount,
            scriptHash: wallet.getScriptHashFromAddress(destinationAddress),
          },
        ]

        const invoke = escrowAccount.scriptHash
        const txConfig = {
          type: 128,
          version: 0,
          outputs: intents,
          script: typeof (invoke) === 'string' ? invoke : sc.createScript(invoke),
          gas: gasCost,
          attributes: [
            {
              usage: 32,
              data: u.reverseHex(escrowAccount.scriptHash),
            },
          ],
          privateKey: escrowAccount.privateKey,
        }

        const unsignedTx = new tx.Transaction(txConfig).calculate(balances)

        const promise = Promise.resolve(unsignedTx.sign(txConfig.privateKey))
        return promise.then((signedTx) => {
          return Object.assign(txConfig, { tx: signedTx })
        })
      })
      .then((c) => {
        console.log('Config object just before sending', c)
        signedTx = c.tx
        signedTx.scripts.unshift({
          invocationScript: '00' + signedTx.scripts[0].invocationScript,
          verificationScript: script,
        })
        return rpc.Query.sendRawTransaction(signedTx).execute(endpt)
      })
      .then((res) => {
        if (res.result === true) {
          this.setState({
            txId: signedTx.hash,
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
        console.log(res)
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

  render() {
    return (
      <div>
        <header className='header' id='header'>
          <div className='container'>
            <figure className='animated fadeInDown delay-07s' />
            <h1 className='animated fadeInDown delay-07s'>Somebody just sent you some crypto currency!</h1>
            <ul className='we-create animated fadeInUp delay-1s'>
              <li>Specifically they sent you NEO or GAS. NEO is a groundbreaking cryptocurrency for building smart contracts and more.</li>
            </ul>
            <a className='link animated fadeInUp delay-1s servicelink' href='#get-started'>Claim Now</a>
          </div>
        </header>

        <Sticky>
          <nav className='main-nav-outer'>
            <div className='container'>
              <ul className='main-nav'>
                <li className='small-logo'><a href='#header'>SEND NEO</a></li>
              </ul>
              <a className='res-nav_click' href='#'>
                <i className='fa-bars' />
              </a>
            </div>
          </nav>
        </Sticky>

        <section className='main-section'>
          <div className='container'>
            <ScrollableAnchor id={ 'get-started' } offset={ '400' }>
              <h2>So What Do I Do?</h2>
            </ScrollableAnchor>
            <h6>You need to provide a public NEO wallet address so the smart contract knows where to send to.</h6>
            <div className='row'>
              <div className='col-sm-7 wow fadeInLeft delay-05s'>
                <p>If you haven’t handled NEO or GAS before, to claim your currency, you’ll need to take a few steps.</p>
                <br />
                <p>First you’ll need to download a wallet. Grab the link below to get NEON wallet.</p>
                <br />
                <p>Next follow the simple steps to create a new address. Copy and paste that address into the form below, submit and in seconds the money will appear in your wallet.</p>
                <br />
                <div className='service-list'>
                  <div className='service-list-col1'>
                    <i className='fa-paper-plane' />
                  </div>
                  <div className='service-list-col2'>
                    <h3><a href='http://neonwallet.com/' target='_blank'>NEON Wallet</a></h3>
                    <p>In our opinion, the best wallet out there with compatibility for NEP5 tokens.</p>
                  </div>
                </div>
                <div className='service-list'>
                  <div className='service-list-col1'>
                    <i className='fa-bullhorn' />
                  </div>
                  <div className='service-list-col2'>
                    <h3><a href='#' target='_blank'>NeoLink Chrome Extension</a></h3>
                    <p>Simple and easy way to get a wallet that you can interact with inside Chrome.</p>
                  </div>
                </div>
              </div>
              <figure className='col-sm-5 text-right wow fadeInUp delay-02s'>
                <CheckLoggedIn setExtensionState={ this.setExtensionState } extensionState={ this.state.extensionState } />

                <div className='panel panel-default'>
                  <div className='panel-heading'>
                    <h3 className='panel-title'>What is the public NEO wallet address?</h3>
                  </div>
                  <div className='panel-body'>
                    <form>
                      <FormGroup
                        controlId='claimForm'
                        validationState={ this.isValidDestinationAddress() }
                      >
                        <FormControl
                          type='text'
                          value={ this.state.destinationAddress }
                          placeholder=''
                          onChange={ this.handleChangeToDestinationAddress }
                          bsSize='large'
                        />
                        <FormControl.Feedback />
                        <HelpBlock />
                      </FormGroup>

                      <div className='button-container'>
                        <Button
                          bsStyle='primary'
                          bsSize='large'
                          block
                          disabled={ !this.state.destinationAddressIsValid || !this.state.extensionState.neoLinkConnected || !this.state.extensionState.isLoggedIn }
                          onClick={ () => this.sendAssets() }
                        >Claim Your NEO</Button>
                        <p className='small text-center'>By clicking the submit button below, you are acknowledging agreement that blah blah blah.</p>
                      </div>
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

export default ClaimPage
