import React, { Component } from 'react'
import { u } from '@cityofzion/neon-js'
import PropTypes from 'prop-types'

import { neonGetTotalAllTime } from '../../../lib/neonWrappers'
import { GAS_ASSET_ID, NEO_ASSET_ID } from '../../../lib/const'

class TotalAllTime extends Component {
  state = {
    totalAllTimeNeo: 0,
    totalAllTimeGas: 0,
    errorMsg: '',
  }

  componentDidMount() {
    const { contractScriptHash, net } = this.props

    let gasAllTime

    neonGetTotalAllTime(contractScriptHash, GAS_ASSET_ID, net)
      .then(gasResponse => {
        if (gasResponse.result) {
          gasAllTime = u.fixed82num(gasResponse.result)
          return neonGetTotalAllTime(contractScriptHash, NEO_ASSET_ID, net)
        } else {
          throw Error('Failed to retrieve GAS all time statistics')
        }
      })
      .then(neoResponse => {
        if (neoResponse.result) {
          this.setState({
            totalAllTimeNeo: u.fixed82num(neoResponse.result),
            totalAllTimeGas: gasAllTime,
          })
        } else {
          throw Error('Failed to retrieve NEO all time statistics')
        }
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

    if (errorMsg !== '') {
      content = <div>Error loading all time stats: {errorMsg}</div>
    } else if (totalAllTimeNeo > 0 || totalAllTimeGas > 0) {
      content = (
        <div className='panel panel-default text-center m-t-50'>
          <div className='panel-heading'>
            <h3>Wow, did you know that...</h3>
          </div>
          <div className='panel-body'>
            <p>People have used Sendeo to send {totalAllTimeGas} GAS and {totalAllTimeNeo} NEO in total!</p>
          </div>
        </div>
      )
    }

    return content
  }
}

TotalAllTime.propTypes = {
  contractScriptHash: PropTypes.string,
  net: PropTypes.string,
}

export default TotalAllTime
