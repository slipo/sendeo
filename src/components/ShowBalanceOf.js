import React, { Component } from 'react'
import Neon, { api, sc, sb, core, rpc, wallet, u, tx } from '@cityofzion/neon-js'

class ShowTotalAllTime extends Component {
  state = {
    balanceNeo: '',
    errorMsg: '',
    isLoading: true,
  }

  componentDidMount() {
    const { sourcePrivateKey, contractScriptHash, net } = this.props
    const gasAssetId = '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'

    this.getBalance(sourcePrivateKey, contractScriptHash, net)
  }

  getBalance = (sourcePrivateKey, contractScriptHash, net) => {
    const sourceAccount = new wallet.Account(sourcePrivateKey)

    console.log(sourceAccount.scriptHash)
    const query = Neon.create.query({
      'method': 'getstorage',
      'params': [
        contractScriptHash,
        // Todo, the first thing here *should* be sourceAccount.scriptHash. Wrong key is in the contract.
        u.reverseHex(contractScriptHash) + u.reverseHex('602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'),
      ],
    })

    api.neonDB.getRPCEndpoint(net)
      .then((url) => {
        const response = query.execute(url)
          .then(res => {
            console.log(res)
            if (res.result) {
              this.setState({
                balanceNeo: u.fixed82num(res.result),
                errorMsg: '',
                isLoading: false,
              })
            }
          })
      })
      .catch((e) => {
        this.setState({
          totalAllTimeNeo: '',
          errorMsg: e.message,
          isLoading: false,
        })
        console.log(e)
      })
  }

  render() {
    const { isLoading, errorMsg, balanceNeo } = this.state

    let content
    if (isLoading) {
      content = 'Loading balance information'
    } else if (errorMsg !== '') {
      content = `Error: ${errorMsg}`
    } else {
      content = `${balanceNeo}`
    }

    return (
      <div>
        Total balance GAS: { content }
      </div>
    )
  }
}

export default ShowTotalAllTime
