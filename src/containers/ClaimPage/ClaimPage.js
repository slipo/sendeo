import React, { Component } from 'react'
import { u } from '@cityofzion/neon-js'

import { GAS_ASSET_ID, NEO_ASSET_ID } from '../../lib/const'
import { neonGetTxAssets, neonGetTxInfo } from '../../lib/neonWrappers'
import ClaimForm from './ClaimForm/ClaimForm'
import { net, contractScriptHash } from '../../AppConfig'

import './ClaimPage.css'

class ClaimPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      escrowPrivateKey: props.match.params.key,
      receivedTxId: props.match.params.receivedTxId,
      loading: true,
      amountReceived: false,
      assetReceived: false,
      message: false,
      spent: false,
      error: false,
    }
  }

  componentDidMount() {
    const { receivedTxId } = this.state

    neonGetTxAssets(receivedTxId, contractScriptHash, net)
      .then(assets => {
        if (assets) {
          const amountReceived = assets[GAS_ASSET_ID] > 0 ? assets[GAS_ASSET_ID] : assets[NEO_ASSET_ID]
          const assetReceived = assets[GAS_ASSET_ID] > 0 ? 'GAS' : 'NEO'

          return neonGetTxInfo(u.reverseHex(receivedTxId), contractScriptHash, net)
            .then(txRes => {
              let message = ''
              console.log(txRes)
              if (txRes.note && txRes.note !== ' ') {
                message = txRes.note
              }
              return this.setState({ spent: txRes.spent, message, amountReceived, assetReceived, loading: false })
            })
            .catch((e) => {
              this.setState({ receivedTxError: true, loading: false })
              return console.error('Error getting claim info', e)
            })
        } else {
          return this.setState({ error: true, loading: false })
        }
      })
      .catch((e) => {
        this.setState({ error: true, loading: false })
        return console.error('Error getting claim information', e)
      })
  }

  render() {
    const {
      escrowPrivateKey,
      receivedTxId,
      amountReceived,
      assetReceived,
      message,
      loading,
      error,
      spent,
    } = this.state

    return (
      <section className='main-section'>
        <div className='container'>
          { loading &&
            <h2 className='page-title'><i className='fa fa-fw fa-spin fa-spinner' /></h2>
          }
          { !loading &&
            <div>
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
                  { (error || spent) &&
                    <div className='alert alert-warning text-left'>
                      <h3 className='text-warning'>Whoops! Claim Not Available</h3>
                      <p className='lead text-warning'>Either we are still waiting for NEO (likely if you just made the deposit a few seconds ago), this deposit has already been claimed, or you were given a bogus link. Blockchain don't lie man.</p>
                      <p>But please, feel free to head over to the <a href='http://neonwallet.com/' target='_blank' rel='noopener noreferrer' >NEON Wallet</a> site and get yourself setup with a wallet.</p>
                    </div>
                  }
                  { !error && !spent &&
                    <div>
                      { message &&
                        <span>
                          <h5>In addition to sending you { amountReceived } { assetReceived }, they were kind enough to leave you a note as well:</h5>
                          <blockquote className='text-left'>
                            <p>{ message }</p>
                          </blockquote>
                        </span>
                      }
                      <h1>So where do you wanna receive your<br />{ amountReceived } { assetReceived }</h1>
                      <ClaimForm
                        escrowPrivateKey={ escrowPrivateKey }
                        receivedTxId={ receivedTxId }
                        amountReceived={ amountReceived }
                        assetReceived={ assetReceived }
                        message={ message }
                      />
                    </div>
                  }
                </figure>
              </div>
            </div>
          }
        </div>
      </section>
    )
  }
}

export default ClaimPage
