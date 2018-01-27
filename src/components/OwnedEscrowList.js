import React, { Component } from 'react'

import { neonGetOwnedEscrowScriptHashes } from '../lib/storage'

class OwnedEscrowList extends Component {
  state = {
    ownedEscrowScriptHashes: null,
    errorMsg: '',
    isLoading: true,
  }

  componentDidMount() {
    const { address, contractScriptHash, net } = this.props
    this.getOwnedEscrowScriptHashes(address, contractScriptHash, net)
  }

  getOwnedEscrowScriptHashes = (address, contractScriptHash, net) => {
    neonGetOwnedEscrowScriptHashes(address, contractScriptHash, net)
      .then((results) => {
        console.log('got some!', results)
        this.setState({
          ownedEscrowScriptHashes: results,
          errorMsg: '',
          isLoading: false,
        })
      })
      .catch((e) => {
        this.setState({
          ownedEscrowScriptHashes: null,
          errorMsg: e.message,
          isLoading: false,
        })
        console.log(e)
      })
  }

  render() {
    return (
      <pre>
        <code>
          { JSON.stringify(this.state, null, 2) }
        </code>
      </pre>
    )
  }
}

export default OwnedEscrowList
