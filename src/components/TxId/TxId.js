import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import './TxId.css'
import { neoScanBaseUrl } from '../../AppConfig'

class TxId extends Component {
  state = {
    copied: false,
  }

  onCopy() {
    this.setState({ copied: true })

    setTimeout(() => {
      this.setState({ fadeOut: true })
    }, 3000)

    setTimeout(() => {
      this.setState({ copied: false, fadeOut: false })
    }, 5000)
  }

  render() {
    const { txId } = this.props

    return (
      <div className='tx-container'>
        { this.state.copied && <div className={ `copied-container ${this.state.fadeOut ? 'fadeOut' : ''}` }>Copied to Clipboard</div> }

        <a href={ `${neoScanBaseUrl}${txId}` } target='_blank'>
          { txId }
        </a>

        <CopyToClipboard text={ txId } onCopy={ () => this.onCopy() } >
          <span ref='clipboard-icon-container'><i className='fa fa-fw fa-clipboard' /></span>
        </CopyToClipboard>
      </div>
    )
  }
}

TxId.propTypes = {
  txId: PropTypes.string.isRequired,
}

export default TxId
