import React, { Component } from 'react'

class CheckExtension extends Component {
  handleNeolinkResponse = (event) => {
    console.log('in handleNeolinkResponse', event)
    if (event.data && event.data.type === 'GET_EXTENSION_STATUS_RESPONSE') {
      console.log('got it in handleNeolinkResponse', event)
      console.log('GET_EXTENSION_STATUS_RESPONSE', event)
    }
  }

  componentDidMount = () => {
    console.log('componentDidMount')
    window.postMessage({
      type: 'GET_EXTENSION_STATUS',
    }, '*')

    // todo: remove on unmount
    window.addEventListener('message', this.handleNeolinkResponse, false)
  }

  render() {
    return (
      <div >
        TODO: check extension.
      </div>
    )
  }
}

export default CheckExtension
