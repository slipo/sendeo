import { net, contractScriptHash } from '../src/AppConfig'
import { neonJsClaim } from '../src/lib/neonWrappers'

import * as neonJs from '@cityofzion/neon-js'
import axios from 'axios'

const apiEndpoint = neonJs.api.neonDB.getAPIEndpoint(net)

function neonGetUnspent(apiEndpoint, contractScriptHash) {
  const smartContractAddress = neonJs.wallet.getAddressFromScriptHash(contractScriptHash)
  return axios.get(apiEndpoint + '/v2/address/balance/' + smartContractAddress).then(res => {
    const unspent = [...res.data.NEO.unspent, ...res.data.GAS.unspent]
    return unspent
  })
}

function neonGetAddressOfTx(apiEndpoint, txId) {
  return axios.get(apiEndpoint + '/v2/transaction/' + txId).then(res => {
    return res.data.vin_verbose[0].address
  })
}

neonGetUnspent(apiEndpoint, contractScriptHash)
  .then(unspent => {
    const tmpSenderAccount = new neonJs.wallet.Account()

    for (const vin of unspent) {
      neonGetAddressOfTx(apiEndpoint, vin.txid)
        .then(address => {
          neonJsClaim(address, tmpSenderAccount.WIF, net, contractScriptHash, vin.txid)
        })
    }
  })
  .catch(e =>
    console.error('Error getting unspent', e.message)
  )
