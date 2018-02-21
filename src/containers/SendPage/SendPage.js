import React, { Component } from 'react'

import SendForm from './SendForm/SendForm'
import CheckLoggedIn from '../../components/CheckLoggedIn/CheckLoggedIn'
import WalletBalance from '../../components/WalletBalance/WalletBalance'

import './SendPage.css'

import neoLogo from '../../images/neo-logo.svg'
import secretUrlIcon from '../../images/secret-url.svg'
import pointingIcon from '../../images/pointing.svg'

class SendPage extends Component {
  state = {
    extensionState: {
      neoLinkConnected: null,
      isLoggedIn: null,
      address: null,
    },
  }

  setExtensionState = (neoLinkConnected, isLoggedIn, address) => {
    this.setState({ extensionState: { neoLinkConnected, isLoggedIn, address } })
  }

  render() {
    const {
      extensionState,
    } = this.state

    return (
      <div>
        <CheckLoggedIn setExtensionState={ this.setExtensionState } extensionState={ extensionState } />

        <section className='main-section'>
          <div className='container'>
            <h2 className='page-title'>Sendeo is a smart contract that serves as a temporary escrow account that can be claimed by others.</h2>
            <div className='row'>
              <div className='col-sm-7 wow fadeInLeft delay-05s left-side'>
                <div className='service-list'>
                  <div className='service-list-col1'>
                    <img src={ neoLogo } alt='NEO logo' />
                  </div>
                  <div className='service-list-col2'>
                    <h3>1. Login to <a href='https://github.com/CityOfZion/NeoLink' target='_blank' rel='noopener noreferrer'>NeoLink</a></h3>
                    <p>NeoLink is a browser extension that lets you interact with the NEO blockchain safely and securely.</p>
                  </div>
                </div>
                <hr />
                <div className='service-list reverse'>
                  <div className='service-list-col1'>
                    <h3>2. Choose how much NEO or GAS and deposit</h3>
                    <p>You then get a secret URL that you can share with anyone to claim their assets.</p>
                  </div>
                  <div className='service-list-col2'>
                    <img src={ secretUrlIcon } alt='Safe and Secure' />
                  </div>
                </div>
                <hr />
                <div className='service-list'>
                  <div className='service-list-col1 smaller-image'>
                    <img src={ pointingIcon } alt='where to deposit icon' />
                  </div>
                  <div className='service-list-col2'>
                    <h3>3. They click the link and say where to send it to</h3>
                    <p>If they don't have a wallet yet, don't worry. We got them covered with all the info they need.</p>
                  </div>
                </div>
              </div>
              <figure className='col-sm-5 text-right wow fadeInUp delay-02s form-container'>
                <h1>So, how much you gonna send?</h1>
                { extensionState.address && <WalletBalance address={ extensionState.address } /> }
                <SendForm neoLinkConnected={ extensionState.neoLinkConnected } isLoggedIn={ extensionState.isLoggedIn } />
              </figure>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default SendPage
