import React, { Component } from 'react'
import Neon, { api, u } from '@cityofzion/neon-js'

import { GAS_ASSET_ID, NEO_ASSET_ID } from '../lib/const'
import { neonGetTotalAllTime } from '../lib/storage'

class ShowTotalAllTime extends Component {
  state = {
    errorMsg: '',
    isLoading: true,
  }

  gasAssetId = '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
  neoAssetId = 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'

  componentDidMount() {
    const { contractScriptHash, net } = this.props
    this.getTotalAllTime(contractScriptHash, GAS_ASSET_ID, net)
    this.getTotalAllTime(contractScriptHash, NEO_ASSET_ID, net)
  }

  getTotalAllTime = (contractScriptHash, assetId, net) => {
    neonGetTotalAllTime(contractScriptHash, assetId, net)
      .then(res => {
        if (res.result) {
          const newState = {
            errorMsg: '',
            isLoading: false,
          }

          newState[assetId] = u.fixed82num(res.result)
          this.setState(newState)
        }
      })
      .catch((e) => {
        this.setState({
          assetId: '',
          errorMsg: e.message,
          isLoading: false,
        })
      })
  }

  render() {
    const { isLoading, errorMsg } = this.state

    let content
    if (isLoading) {
      content = 'Loading total deposited NEO information'
    } else if (errorMsg !== '') {
      content = `Error: ${errorMsg}`
    } else {
      content = `neo ${this.state[NEO_ASSET_ID]}, gas ${this.state[GAS_ASSET_ID]}`
    }

    return (
      <div>
        Total Deposited: { content }
      </div>
    )
  }
}

export default ShowTotalAllTime
