import React, { Component } from 'react'
import Neon, { api, u } from '@cityofzion/neon-js'

import { GAS_ASSET_ID, NEO_ASSET_ID } from '../lib/const'
import { neonGetTotalAllTime } from '../lib/storage'

class GetTotalAllTime extends Component {
  componentDidMount() {
    const { contractScriptHash, net } = this.props
    this.getTotalAllTime(contractScriptHash, GAS_ASSET_ID, net)
    this.getTotalAllTime(contractScriptHash, NEO_ASSET_ID, net)
  }

  getTotalAllTime = (contractScriptHash, assetId, net) => {
    neonGetTotalAllTime(contractScriptHash, assetId, net)
      .then(res => {
        if (res.result) {
          // sooper ugly but race conditions i think (TODO)
          if (assetId == GAS_ASSET_ID) {
            this.props.setGasAllTimeState(u.fixed82num(res.result))
          } else {
            this.props.setNeoAllTimeState(u.fixed82num(res.result))
          }
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
    return ''
  }
}

export default GetTotalAllTime
