import React, { Component } from 'react'
import { u } from '@cityofzion/neon-js'

import * as neonWrappers from '../../lib/neonWrappers'
import { GAS_ASSET_ID, NEO_ASSET_ID } from '../../lib/const'
import { net, contractScriptHash } from '../../AppConfig'

class TotalAllTime extends Component {
  state = {
    totalAllTimeNeo: 0,
    totalAllTimeGas: 0,
    errorMsg: '',
  }

  componentDidMount() {
    let gasAllTime
    let neoAllTime

    neonWrappers.neonGetTotalAllTime(contractScriptHash, GAS_ASSET_ID, net)
      .then(gasResponse => {
        if (gasResponse.result) {
          gasAllTime = u.fixed82num(gasResponse.result)
        } else {
          gasAllTime = 0
        }

        return neonWrappers.neonGetTotalAllTime(contractScriptHash, NEO_ASSET_ID, net)
      })
      .then(neoResponse => {
        if (neoResponse.result) {
          neoAllTime = u.fixed82num(neoResponse.result)
        } else {
          neoAllTime = 0
        }

        this.setState({
          totalAllTimeNeo: neoAllTime,
          totalAllTimeGas: gasAllTime,
        })
      })
      .catch((e) => {
        this.setState({
          errorMsg: e.message,
        })
      })
  }

  render() {
    const { totalAllTimeNeo, totalAllTimeGas, errorMsg } = this.state
    let content = ''

    if (errorMsg === '' && (totalAllTimeNeo > 0 || totalAllTimeGas > 0)) {
      content = (
        <h3 className='page-title'>Proudly facilitating the transfer of <strong>{totalAllTimeNeo} NEO</strong> and <strong>{totalAllTimeGas} GAS</strong></h3>
      )
    }

    return content
  }
}

export default TotalAllTime
