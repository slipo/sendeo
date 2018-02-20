import React, { Component } from 'react'
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
    const { isLoading } = this.state

    let statusText
    let statusClass

    if (!isLoading) {
      if (extensionState.isLoggedIn === true) {
        statusClass = 'success'
        statusText = <i className='fa fa-fw fa-check' />
      } else if (extensionState.neoLinkConnected === true) {
        statusClass = 'warning'
        statusText = <i className='fa fa-fw fa-warning' />
      } else if (this.state.loading) {
        statusText = <i className='fa fa-fw fa-spin fa-spinner' />
      } else {
        statusClass = 'danger'
        statusText = <i className='fa fa-fw fa-exclamation-triangle' />
      }
    } else {
      statusClass = 'info'
      statusText = <i className='fa fa-fw fa-spinner fa-spin' />
    }
    return (
      <div id='neo-link-status-container' className={ `text-right alert alert-${statusClass}` }>
        <div className='status-title lead'>NeoLink: <strong>{statusText}</strong></div>
      </div>
    )
  }
}

CheckLoggedIn.propTypes = {
  extensionState: PropTypes.object.isRequired,
  setExtensionState: PropTypes.func.isRequired,
}

export default CheckLoggedIn
