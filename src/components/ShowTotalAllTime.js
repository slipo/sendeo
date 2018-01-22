import React, { Component } from 'react';
import Neon, { api, sc, sb, core, rpc, wallet, u, tx } from '@cityofzion/neon-js';

class ShowTotalAllTime extends Component {
  state = {
    '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7': '',
    'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b': '',
    errorMsg: '',
    isLoading: true
  }

  gasAssetId = '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
  neoAssetId = 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'

  componentDidMount() {
    const { contractScriptHash, net } = this.props
    this.getTotalAllTime(contractScriptHash, this.gasAssetId, net);
    this.getTotalAllTime(contractScriptHash, this.neoAssetId, net);
  }

  getTotalAllTime = (contractScriptHash, assetId, net) => {
    const query = Neon.create.query({
      'method' : 'getstorage',
      'params' : [
        contractScriptHash,
        u.str2hexstring('totalAllTime') + u.reverseHex(assetId)
      ]
    })

    api.neonDB.getRPCEndpoint(net)
      .then((url) => {
        const response = query.execute(url)
          .then(res => {
            console.log(res)
            if (res.result) {
              const newState = {
                errorMsg: '',
                isLoading: false
              }
              newState[assetId] = u.fixed82num(res.result)
              console.log(newState)
              this.setState(newState)
            }
          })
      })
      .catch((e) => {
        this.setState({
          assetId: '',
          errorMsg: e.message,
          isLoading: false
        })
        console.log(e)
      })
  }

  render() {
    const { isLoading, errorMsg, totalAllTimeNeo } = this.state

    let content
    if (isLoading) {
      content = 'Loading total deposited NEO information'
    } else if (errorMsg !== '') {
      content = `Error: ${errorMsg}`
    } else {
      content = `neo ${this.state[this.neoAssetId]}, gas ${this.state[this.gasAssetId]}`
    }

    return (
      <div>
        Total Deposited: { content }
      </div>
    );
  }
}

export default ShowTotalAllTime;