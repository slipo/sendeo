import React, { Component } from 'react'
import { Alert } from 'react-bootstrap'
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

    console.log('extensionState', extensionState)
    if (extensionState.isLoggedIn === true) {
      content = `address: ${extensionState.address}`
    } else if (extensionState.isInstalled === true) {
      content = (
        <Alert bsStyle='warning'>
          <strong>Please Unlock NeoLink</strong>
          <p>Once you unlock NeoLink, you will be able to send the transaction through the NEO blckchain.</p>
        </Alert>
      )
    } else if (extensionState.isInstalled === false) {
      content = 'please install'
    } else {
      content = 'loading'
    }

    return (
      <div>
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
