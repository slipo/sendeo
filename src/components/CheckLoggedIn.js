import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CheckLoggedIn extends Component {
  handleNeolinkResponse = (event) => {
    const { setExtensionState } = this.props

    if (event.data && event.data.type === 'NEOLINK_GET_EXTENSION_STATUS_RESPONSE') {
      setExtensionState(true, event.data.result.isLoggedIn, event.data.result.address)
    }
  }

  authCheckTimeout = () => {
    const { extensionState, setExtensionState } = this.props

    if (extensionState.neoLinkConnected !== true) {
      setExtensionState(false, false, '')
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
      statusText = 'Installed and Unlocked'
      content = (
        <p>Wallet Address: <strong>{extensionState.address}</strong></p>
      )
    } else if (extensionState.neoLinkConnected === true) {
      statusClass = 'warning'
      statusText = 'Installed but not Unlocked'
      content = (
        <p>Once you unlock NeoLink, you will be able to send the transaction through the NEO blckchain.</p>
      )
    } else if (extensionState.isInstalled === false) {
      statusClass = 'warning'
      statusText = 'Not Installed'
      content = (
        <p>Please install the NeoLink browser extension and then refresh this page.</p>
      )
    } else {
      statusText = 'Connecting to NeoLink...'
    }

    return (
      <div className='neo-status well text-center'>
        <h4>NeoLink Status: <strong><span className={ `text-${statusClass}` }>{statusText}</span></strong></h4>
        { content }
      </div>
    )
  }
}

CheckLoggedIn.propTypes = {
  extensionState: PropTypes.object.isRequired,
  setExtensionState: PropTypes.func.isRequired,
}

export default CheckLoggedIn
