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

import { neonJsClaim } from '../../lib/invocations'
import { GAS_ASSET_ID, NEO_ASSET_ID } from '../../lib/const'

import GetBalanceOf from './Balance/Balance'
import GetTotalAllTime from './TotalAllTime/TotalAllTime'

import './ClaimPage.css'
import logo from '../../images/logo-flat.png'

class ClaimPage extends Component {
  constructor(props) {
    super(props)

    this.isValidDestinationAddress = this.isValidDestinationAddress.bind(this)
    this.handleChangeToDestinationAddress = this.handleChangeToDestinationAddress.bind(this)
    this.sendAssets = this.sendAssets.bind(this)

    this.state = {
      destinationAddress: '',
      destinationAddressIsValid: false,
      escrowPrivateKey: props.match.params.key,
      receivedTxId: props.match.params.receivedTxId,
      balanceLoading: true,
      txId: '',
      txAmount: 0,
      txCreated: '',
      txNote: '',
      totalAllTimeNeo: 0,
      totalAllTimeGas: 0,
      spent: false,
      status: '',
      errorMsg: '',
      assets: null,
    }
  }

  setBalanceState = (assets, spent, txCreated, txNote) => {
    this.setState({ assets, spent, txCreated, txNote, balanceLoading: false })
  }

  setGasAllTimeState = (totalAllTimeGas) => {
    this.setState({ totalAllTimeGas: totalAllTimeGas })
  }

  setNeoAllTimeState = (totalAllTimeNeo) => {
    this.setState({ totalAllTimeNeo: totalAllTimeNeo })
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

    const { escrowPrivateKey, destinationAddress, receivedTxId } = this.state
    const { contractScriptHash, net } = this.props

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

  render() {
    const { receivedTxId, assets, spent } = this.state
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
                <li><Link to='/send?asset=neo'>Send NEO</Link></li>
                <li><Link to='/send?asset=gas'>Send GAS</Link></li>
                <li className='small-logo'>
                  <Link to='/'>
                    <img src={ logo } alt='Sendeo Logo Flat' />
                  </Link>
                </li>
                <li><Link to='/previousSends'>Your History</Link></li>
                <li><Link to='/about'>About</Link></li>
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
                { this.state.balanceLoading &&
                  <div className='well'>
                    <p className='text-center'><i className='fa fa-fw fa-spin fa-spinner' /> Retrieving information about this claim...</p>
                  </div>
                }

                { !this.state.balanceLoading && !this.state.assets &&
                  <div className='panel panel-danger text-left'>
                    <div className='panel-body'>
                      <h3>Whoops!</h3>
                      <p className='lead text-danger'>This has already been claimed or is no longer valid. Blockchain don't lie man.</p>
                      <p>But please, do yourself a favor and get your self a wallet. You'll thank me later.</p>
                    </div>
                  </div>
                }

                { (!this.state.balanceLoading && assets !== null) &&
                  <div className='panel panel-default'>
                    <div className='panel-body'>
                      { assets[GAS_ASSET_ID] > 0 && <h3>You have been sent { assets[GAS_ASSET_ID] } GAS (TODO)!</h3>}
                      { assets[NEO_ASSET_ID] > 0 && <h3>You have been sent { assets[NEO_ASSET_ID] } NEO (TODO)!</h3>}
                      { spent && <h3>Assets were claimed already.</h3>}
                      <p className='lead'>Give us a public wallet address and we will send it right over.</p>

                      <form>
                        <FormGroup
                          controlId='claimForm'
                          validationState={ this.isValidDestinationAddress() }
                        >
                          <FormControl
                            type='text'
                            value={ this.state.destinationAddress }
                            placeholder='Public wallet address'
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
                }

                { this.state.status === 'success' &&
                  <div className='alert alert-success text-center'>
                    <p className='lead'><strong>Success!</strong></p>
                    <p>The transaction went through and can be seen <a href={ `http://35.192.230.39:5000/v2/transaction/${this.state.txId}` } target='_blank'>by clicking here.</a> You will have to wait a few seconds to let the block get processed.</p>
                  </div>
                }

                { (this.state.totalAllTimeNeo > 0 || this.state.totalAllTimeGas > 0) && (this.state.totalAllTimeGas > this.state.txAmount || this.state.totalAllTimeNeo > this.state.txAmount) &&
                  <div className='panel panel-default text-center'>
                    <div className='panel-heading'>
                      <h3>Wow, did you know that...</h3>
                    </div>
                    <div className='panel-body'>
                      <p>You are not the first to receive GAS from this person. In fact they have now sent {this.state.totalAllTimeGas} GAS in total! TODO</p>
                    </div>
                  </div>
                }

                <GetBalanceOf
                  txId={ receivedTxId }
                  contractScriptHash={ contractScriptHash }
                  net={ net }
                  setBalanceState={ this.setBalanceState }
                />
                <GetTotalAllTime
                  contractScriptHash={ contractScriptHash }
                  net={ net }
                  setGasAllTimeState={ this.setGasAllTimeState }
                  setNeoAllTimeState={ this.setNeoAllTimeState }
                />
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
