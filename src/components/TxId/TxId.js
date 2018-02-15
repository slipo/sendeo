import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './TxId.css'
import { neoScanBaseUrl } from '../../AppConfig'

class TxId extends Component {
  render() {
    const { txId } = this.props

    return (
      <div className='tx-container'>
        <a href={ `${neoScanBaseUrl}${txId}` } target='_blank'>
          { txId }
        </a>
      </div>
    )
  }
}

TxId.propTypes = {
  txId: PropTypes.string.isRequired,
}

export default TxId
