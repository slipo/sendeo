import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ForceHttp extends Component {
  render() {
    if (
      typeof window !== 'undefined' &&
      window.location &&
      window.location.protocol === 'https:'
    ) {
      window.location.href = window.location.href.replace(/^https/, 'http')
    }

    return (
      <div>
        { this.props.children }
      </div>
    )
  }
}

ForceHttp.propTypes = {
  children: PropTypes.node,
}

export default ForceHttp
