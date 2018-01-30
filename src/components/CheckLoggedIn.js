import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import './CheckLoggedIn.css'

class CheckLoggedIn extends Component {
  state = {
    isLoading: true,
  }

  handleNeolinkResponse = (event) => {
    const { setExtensionState } = this.props

    if (event.data && event.data.type === 'NEOLINK_GET_EXTENSION_STATUS_RESPONSE') {
      setExtensionState(true, event.data.result.isLoggedIn, event.data.result.address)
      this.setState({ isLoading: false })
    }
  }

  authCheckTimeout = () => {
    const { extensionState, setExtensionState } = this.props

    if (extensionState.neoLinkConnected !== true) {
      setExtensionState(false, false, '')
      this.setState({ isLoading: false })
    }
  }

  componentWillUnmount() {
    clearTimeout(this.authCheckTimeoutTimer)
    window.removeEventListener('message', this.handleNeolinkResponse)
  }

  componentDidMount = () => {
    window.postMessage({ type: 'NEOLINK_GET_EXTENSION_STATUS' }, '*')
    window.addEventListener('message', this.handleNeolinkResponse, false)
    this.authCheckTimeoutTimer = setTimeout(this.authCheckTimeout, 3000)
  }

  render() {
    const { extensionState } = this.props

    let content
    let statusText
    let statusClass

    console.log('extensionState', extensionState)
    if (extensionState.isLoggedIn === true) {
      statusClass = 'success'
      statusText = <i className='fa fa-fw fa-check' />
      content = (
        <p className='text-right'>
          <small>
            <a href={ `http://35.192.230.39:5000/v2/address/balance/${extensionState.address}` } target='_blank'>View Wallet</a>
          </small>
        </p>
      )
    } else if (extensionState.neoLinkConnected === true) {
      statusClass = 'warning'
      statusText = <i className='fa fa-fw fa-warning' />
      content = (
        <p className='text-right'>
          <small>Once you unlock NeoLink, you will be able to send the transaction through the NEO blckchain.</small>
        </p>
      )
    } else if (this.state.loading) {
      statusText = <i className='fa fa-fw fa-spin fa-spinner' />
    } else {
      statusClass = 'danger'
      statusText = <i className='fa fa-fw fa-exclamation-triangle' />
      content = (
        <p className='text-right'>
          <small>Please install the <a href='https://github.com/slipo/neolink/tree/dapp'>NeoLink browser extension</a> and then refresh this page.</small>
        </p>
      )
    }

    return (
      <div id='neo-link-status-container' className={ `text-right alert alert-${statusClass}` }>
        <div className='status-title lead'>NeoLink Status: <strong>{statusText}</strong></div>
        <div className='status-content'>{ content }</div>
      </div>
    )
  }
}

CheckLoggedIn.propTypes = {
  extensionState: PropTypes.object.isRequired,
  setExtensionState: PropTypes.func.isRequired,
}

export default CheckLoggedIn
