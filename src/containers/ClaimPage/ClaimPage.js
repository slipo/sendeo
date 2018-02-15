import React, { Component } from 'react'

import { GAS_ASSET_ID, NEO_ASSET_ID } from '../../lib/const'

import GetBalanceOf from './Balance/Balance'
import Header from '../../components/Header/Header'
import ClaimForm from './ClaimForm/ClaimForm'
import { net, contractScriptHash } from '../../AppConfig'

import './ClaimPage.css'

class ClaimPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      escrowPrivateKey: props.match.params.key,
      receivedTxId: props.match.params.receivedTxId,
      balanceLoading: true,
      txId: '',
      txCreated: '',
      txNote: '',
      spent: false,
      status: '',
      errorMsg: '',
      assets: null,
    }
  }

  setBalanceState = (assets, spent, txCreated, txNote) => {
    this.setState({ assets, spent, txCreated, txNote, balanceLoading: false })
  }

  render() {
    const {
      escrowPrivateKey,
      receivedTxId,
      assets,
    } = this.state

    let amountReceived = 0
    let assetReceived = 0

    if (assets) {
      amountReceived = assets[GAS_ASSET_ID] > 0 ? assets[GAS_ASSET_ID] : assets[NEO_ASSET_ID]
      assetReceived = assets[GAS_ASSET_ID] > 0 ? 'GAS' : 'NEO'
    }

    return (
      <div>
        <Header />

        <section className='main-section'>
          <div className='container'>
            <h2 className='page-title'><span role='img' aria-label='boom'>&#128165;</span> Someone just sent you { amountReceived } { assetReceived }!! <span role='img' aria-label='boom'>&#128165;</span></h2>
            <div className='row'>
              <div className='col-sm-7 wow fadeInLeft delay-05s left-side'>
                <h3 className='text-center m-t-50'>All you need to do is provide your public NEO address.</h3>
                <h1 className='text-center shrugger m-t-50 m-b-50'>¯\_(ツ)_/¯</h1>
                <h3 className='text-center m-b-50'>What? You don't have one? Pshh... it's super easy.<br />Go <a href='http://neonwallet.com/' target='_blank' rel='noopener noreferrer' >here</a> and get the <a href='http://neonwallet.com/' target='_blank' rel='noopener noreferrer' >official NEON Wallet</a></h3>
                <h5 className='text-center'>Check out this video that will walk you through the process.</h5>
                <p className='text-center'>
                  <iframe width='560' height='315' title='tutorial video' src='https://www.youtube.com/embed/Xq5iiM5n4yE?rel=0&amp;showinfo=0' frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen />
                </p>
              </div>
              <figure className='col-sm-5 text-right wow fadeInUp delay-02s form-container'>
                { this.state.balanceLoading &&
                  <div className='well'>
                    <p className='text-center'><i className='fa fa-fw fa-spin fa-spinner' /> Retrieving information about this claim...</p>
                  </div>
                }

                { !this.state.balanceLoading && !this.state.assets &&
                  <div className='alert alert-danger text-left'>
                    <h3>Whoops!</h3>
                    <p className='lead text-danger'>This has already been claimed or is no longer valid. Blockchain don't lie man.</p>
                    <p>But please, feel free to head over to the <a href='http://neonwallet.com/' target='_blank' rel='noopener noreferrer' >NEON Wallet</a> site and get yourself setup with a wallet.</p>
                  </div>
                }

                { !this.state.balanceLoading && assets !== null &&
                  <div>
                    <h1>So where do you wanna receive your<br />{ amountReceived } { assetReceived }</h1>
                    <ClaimForm
                      escrowPrivateKey={ escrowPrivateKey }
                      receivedTxId={ receivedTxId }
                      amountReceived={ amountReceived }
                      assetReceived={ assetReceived }
                    />
                  </div>
                }

                <GetBalanceOf
                  txId={ receivedTxId }
                  contractScriptHash={ contractScriptHash }
                  net={ net }
                  setBalanceState={ this.setBalanceState }
                />
              </figure>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default ClaimPage
