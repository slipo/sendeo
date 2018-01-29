import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap'
import Sticky from 'react-stickynode'
import ScrollableAnchor from 'react-scrollable-anchor'

import { neonJsClaim } from '../lib/invocations'

import CheckLoggedIn from '../components/CheckLoggedIn'
import ShowBalanceOf from '../components/ShowBalanceOf'
import ShowTotalAllTime from '../components/ShowTotalAllTime'

import './ClaimPage.css'

class ClaimPage extends Component {
  constructor(props) {
    super(props)

    this.isValidDestinationAddress = this.isValidDestinationAddress.bind(this)
    this.handleChangeToDestinationAddress = this.handleChangeToDestinationAddress.bind(this)
    this.sendAssets = this.sendAssets.bind(this)
    this.setExtensionState = this.setExtensionState.bind(this)

    console.log(props)

    this.state = {
      destinationAddress: '',
      destinationAddressIsValid: false,
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

    const { escrowPrivateKey, destinationAddress } = this.state
    const { contractScriptHash, net } = this.props

    neonJsClaim(destinationAddress, escrowPrivateKey, net, contractScriptHash)
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
    const { escrowPrivateKey } = this.state
    const { contractScriptHash, net } = this.props

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
                <li><Link to='/?asset=neo#get-started'>Send NEO</Link></li>
                <li><Link to='/?asset=gas#get-started'>Send GAS</Link></li>
                <li><Link to='/previousSends'>Previous Sends</Link></li>
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
                <p className='lead'>If you don't have one already, get yourself a wallet. We recommend these guys:</p>

                <div className='service-list'>
                  <div className='service-list-col1'>
                    <i className='fa-paper-plane' />
                  </div>
                  <div className='service-list-col2'>
                    <h3><a href='http://neonwallet.com/' target='_blank' rel='noopener noreferrer'>NEON Wallet</a></h3>
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

                <p className='lead'>Check out this video tutorial to help guide you.</p>
                <iframe width='560' height='315' src='https://www.youtube.com/embed/ZWZFiixYfnM?rel=0&amp;showinfo=0' frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen />
              </div>
              <figure className='col-sm-5 text-right wow fadeInUp delay-02s'>
                <div className='panel panel-default'>
                  <div className='panel-heading'>
                    <h3 className='panel-title'>What is the public wallet address that will receive this gift?</h3>
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
                          disabled={ !this.state.destinationAddressIsValid || this.state.status === 'loading' }
                          onClick={ () => this.sendAssets() }
                        >Claim Your NEO</Button>
                        <p className='small text-center terms-text'>By clicking the submit button below, you are acknowledging agreement that blah blah blah.</p>
                      </div>
                    </form>
                  </div>
                </div>

                { this.state.status === 'success' &&
                  <div className='alert alert-success'>
                    <p className='lead'><strong>Success!</strong></p>
                    <p>The transaction went through and can be seen <a href={ `http://35.192.230.39:5000/v2/transaction/${this.state.txId}` } target='_blank'>by clicking here.</a> You will have to wait a few seconds to let the block get processed.</p>
                  </div>
                }
                <ShowBalanceOf escrowPrivateKey={ escrowPrivateKey } contractScriptHash={ contractScriptHash } net={ net } />
                <ShowTotalAllTime contractScriptHash={ contractScriptHash } net={ net } />
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
