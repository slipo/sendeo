import Neon, { api, sc, rpc, wallet, u, tx } from '@cityofzion/neon-js'
import axios from 'axios'
import { GAS_ASSET_ID, NEO_ASSET_ID } from './const'

export function neonJsClaim(destinationAddress, escrowPrivateKey, net, contractScriptHash, receivedTxId) {
  const escrowAccount = new wallet.Account(escrowPrivateKey)

  const gasCost = 0

  let signedTx
  let endpt
  let script

  const inputs = []
  const intents = []

  return api.neonDB.getRPCEndpoint(net)
    .then((result) => {
      endpt = result
      return axios.get(`${net}/v2/transaction/${receivedTxId}`)
    })
    .then((transactionsResponse) => {
      const vouts = transactionsResponse.data.vout

      for (const vout of vouts) {
        if (vout.address === wallet.getAddressFromScriptHash(contractScriptHash)) {
          inputs.push({ prevHash: receivedTxId, prevIndex: vout.n })

          intents.push({
            assetId: vout.asset.slice(2),
            value: vout.value,
            scriptHash: wallet.getScriptHashFromAddress(destinationAddress),
          })
        }
      }

      const query = Neon.create.query({
        'method': 'getcontractstate',
        'params': [ contractScriptHash ],
      })

      return query.execute(endpt)
    })
    .then((contractState) => {
      script = contractState.result.script

      const invoke = {
        scriptHash: contractScriptHash,
      }

      const txConfig = {
        type: 128,
        version: 0,
        outputs: intents,
        script: typeof (invoke) === 'string' ? invoke : sc.createScript(invoke),
        gas: gasCost,
        attributes: [
          {
            usage: 32,
            data: u.reverseHex(escrowAccount.scriptHash),
          },
        ],
        privateKey: escrowAccount.privateKey,
      }

      const unsignedTx = new tx.Transaction(txConfig)
      unsignedTx.inputs = inputs

      const promise = Promise.resolve(unsignedTx.sign(txConfig.privateKey))
      return promise.then((signedTx) => {
        return Object.assign(txConfig, { tx: signedTx })
      })
    })
    .then((c) => {
      signedTx = c.tx

      const contractScriptSigning = {
        invocationScript: '00' + signedTx.scripts[0].invocationScript,
        verificationScript: script,
      }
      if (parseInt(contractScriptHash, 16) > parseInt(escrowAccount.scriptHash, 16)) {
        signedTx.scripts.push(contractScriptSigning)
      } else {
        signedTx.scripts.unshift(contractScriptSigning)
      }

      return rpc.Query.sendRawTransaction(signedTx).execute(endpt)
    })
    .then((res) => {
      if (res.result === true) {
        res.txid = signedTx.hash
      }
      return res
    })
}

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
        assets[vout.asset.slice(2)] += parseFloat(vout.value) // todo, switch to bignumber
      }
    })
  })

  return assets
}

export function neonGetIsUnspent(txId, contractScriptHash, net) {
  const apiEndpoint = api.neonDB.getAPIEndpoint(net)
  const smartContractAddress = wallet.getAddressFromScriptHash(contractScriptHash)
  return axios.get(apiEndpoint + '/v2/address/balance/' + smartContractAddress).then(res => {
    const unspent = [...res.data.NEO.unspent, ...res.data.GAS.unspent]
    const unspentTxIds = Array.from(unspent, a => a.txid)
    return !!unspentTxIds.includes(txId)
  })
}

export function neonGetTxAssets(txId, contractScriptHash, net) {
  const apiEndpoint = api.neonDB.getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/transaction/' + txId)
    .then((res) => {
      return assetsFromVouts([res.data.vout], contractScriptHash)
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

  return deserializedArray
}

export function neonGetTxHistory(keyPrefix, address, contractScriptHash, net) {
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

  let result = false

  return api.neonDB.getRPCEndpoint(net)
    .then((url) => {
      return query.execute(url)
        .then(res => {
          if (res.result) {
            result = deserializeArray(res.result)
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

            return neonGetIsUnspent(u.reverseHex(txId), contractScriptHash, net)
          }

          return false
        })
        .then(unspent => {
          if (result) {
            result.spent = !unspent
          }

          return result
        })
    })
}
