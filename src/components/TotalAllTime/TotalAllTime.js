import React, { Component } from 'react'
import { u } from '@cityofzion/neon-js'

import { neonGetTotalAllTime } from '../../lib/neonWrappers'
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

    neonGetTotalAllTime(contractScriptHash, GAS_ASSET_ID, net)
      .then(gasResponse => {
        if (gasResponse.result) {
          gasAllTime = u.fixed82num(gasResponse.result)
          return neonGetTotalAllTime(contractScriptHash, NEO_ASSET_ID, net)
        } else {
          throw Error('Failed to retrieve GAS all time statistics', gasResponse)
        }
      })
      .then(neoResponse => {
        if (neoResponse.result) {
          this.setState({
            totalAllTimeNeo: u.fixed82num(neoResponse.result),
            totalAllTimeGas: gasAllTime,
          })
        } else {
          throw Error('Failed to retrieve NEO all time statistics', neoResponse)
        }
      })
      .catch((e) => {
        console.error('Error getting all time stats', e)
        this.setState({
          errorMsg: e.message,
        })
      })
  }

  render() {
    const { totalAllTimeNeo, totalAllTimeGas, errorMsg } = this.state
    let content = ''

    if (errorMsg === '' && totalAllTimeNeo > 0 || totalAllTimeGas > 0) {
      content = (
        <h4>Proudly facilitating the transfer of {totalAllTimeNeo} NEO and {totalAllTimeGas} GAS</h4>
      )
    }

    return content
  }
}

export default TotalAllTime
