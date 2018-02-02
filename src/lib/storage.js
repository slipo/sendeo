import Neon, { wallet, api, u } from '@cityofzion/neon-js'
import axios from 'axios'
import { GAS_ASSET_ID, NEO_ASSET_ID } from './const'

export function neonGetTotalAllTime(contractScriptHash, assetId, net) {
  const query = Neon.create.query({
    'method': 'getstorage',
    'params': [
      contractScriptHash,
      u.str2hexstring('totalAllTime') + u.reverseHex(assetId),
    ],
  })

  return api.neonDB.getRPCEndpoint(net)
    .then((url) => {
      return query.execute(url)
    })
}

function assetsFromVouts(vouts, contractScriptHash) {
  const assets = {}
  assets[NEO_ASSET_ID] = 0
  assets[GAS_ASSET_ID] = 0

  vouts.forEach((voutArray) => {
    voutArray.forEach((vout) => {
      if (vout.address === wallet.getAddressFromScriptHash(contractScriptHash)) {
        console.log(vout)
        assets[vout.asset.slice(2)] += parseFloat(vout.value) // todo, switch to bignumber
      }
    })
  })

  return assets
}

export function neonGetTxAssets(txId, contractScriptHash, net) {
  return axios.get(net + '/v2/transaction/' + txId)
    .then((res) => {
      return assetsFromVouts([res.data.vout], contractScriptHash)
    })
}

// Not in use now but could be used to get the entire balance for a script hash.
export function neonGetBalance(scriptHash, contractScriptHash, net) {
  const query = Neon.create.query({
    'method': 'getstorage',
    'params': [
      contractScriptHash,
      u.str2hexstring('recipient_history') + u.reverseHex(scriptHash),
    ],
  })

  return api.neonDB.getRPCEndpoint(net)
    .then((url) => {
      return query.execute(url)
    })
    .then((res) => {
      if (res.result) {
        const result = deserializeArray(res.result)

        const txIds = []
        for (const txId of result) {
          txIds.push(u.reverseHex(txId))
          // todo, filter out spent
        }
        return txIds
      } else {
        return null
      }
    })
    .then((txIds) => {
      const transactions = []
      const promises = []
      txIds.forEach((txId) => {
        promises.push(axios.get(net + '/v2/transaction/' + txId))
      })

      return axios.all(promises).then(function(results) {
        results.forEach(function(response) {
          transactions.push(response.data.vout)
        })

        return transactions
      })
    })
    .then((vouts) => {
      const assets = {}
      assets[NEO_ASSET_ID] = 0
      assets[GAS_ASSET_ID] = 0

      vouts.forEach((voutArray) => {
        voutArray.forEach((vout) => {
          if (vout.address === wallet.getAddressFromScriptHash(contractScriptHash)) {
            console.log(vout)
            assets[vout.asset.slice(2)] += parseFloat(vout.value) // todo, switch to bignumber
          }
        })
      })

      return assets
    })
}

export function deserializeArray(data) {
  const ss = new Neon.u.StringStream(data)
  const arrayLength = ss.readVarBytes()
  const deserializedArray = []
  for (let i = 0; i < arrayLength; i++) {
    ss.read(1) // item byte size - ignore.
    const itemLength = ss.read(1) // length in bytes.
    deserializedArray.push(ss.read(parseInt(itemLength, 16)))
  }

  // console.log(u.ab2str(u.hexstring2ab(deserializedArray[3])))

  return deserializedArray
}

export function neonGetTxHistory(keyPrefix, address, contractScriptHash, net) {
  console.log('ownerAddress', address)
  const sh = wallet.getScriptHashFromAddress(address)
  const query = Neon.create.query({
    'method': 'getstorage',
    'params': [
      contractScriptHash,
      u.str2hexstring(keyPrefix) + u.reverseHex(sh),
    ],
  })

  return api.neonDB.getRPCEndpoint(net)
    .then((url) => {
      return query.execute(url)
        .then(res => {
          console.log(res)
          let result = false
          if (res.result) {
            result = deserializeArray(res.result)
          }

          return result
        })
    })
}

export function neonGetTxInfo(txId, contractScriptHash, net) {
  const query = Neon.create.query({
    'method': 'getstorage',
    'params': [
      contractScriptHash,
      txId,
    ],
  })

  return api.neonDB.getRPCEndpoint(net)
    .then((url) => {
      return query.execute(url)
        .then(res => {
          console.log('neonGetTxInfo ' + txId, res)
          let result = false
          if (res.result) {
            result = deserializeArray(res.result)
            console.log('txdata', result)
            let createdTime = new Date(parseInt(u.reverseHex(result[2]), 16))
            let dateOffset = (24 * 60 * 60 * 1000) * 7
            let sevenDaysAgo = new Date()
            sevenDaysAgo.setTime(sevenDaysAgo.getTime() - dateOffset)

            let canRescind = createdTime.created < sevenDaysAgo

            result = {
              note: u.hexstring2str(result[3]),
              created: new Date(parseInt(u.reverseHex(result[2]), 16) * 1000).toUTCString(),
              canRescind,
            }
          }

          return result
        })
    })
}
