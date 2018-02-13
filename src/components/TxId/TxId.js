import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './TxId.css'

class TxId extends Component {
  render() {
    const { txId } = this.props

    return <div className='tx-container'>{ txId }</div>
  }
}

TxId.propTypes = {
  txId: PropTypes.string.isRequired,
}

export default TxId
