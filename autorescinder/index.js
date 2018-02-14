const neonJs = require('@cityofzion/neon-js')
const axios = require('axios')

const net = 'http://35.192.230.39:5000/'
const contractScriptHash = '6cce32b8f81f2726386ac0cd1018c992505815cb'

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

function neonJsClaim(destinationAddress, net, contractScriptHash, receivedTxId) {
  const tmpSenderAccount = new neonJs.wallet.Account()

  const gasCost = 0

  let signedTx
  let endpt
  let script

  const inputs = []
  const intents = []

  return neonJs.api.neonDB.getRPCEndpoint(net)
    .then((result) => {
      endpt = result
      return axios.get(`${net}/v2/transaction/${receivedTxId}`)
    })
    .then((transactionsResponse) => {
      const vouts = transactionsResponse.data.vout

      for (const vout of vouts) {
        if (vout.address === neonJs.wallet.getAddressFromScriptHash(contractScriptHash)) {
          inputs.push({ prevHash: receivedTxId, prevIndex: vout.n })

          intents.push({
            assetId: vout.asset.slice(2),
            value: vout.value,
            scriptHash: neonJs.wallet.getScriptHashFromAddress(destinationAddress),
          })
        }
      }

      const query = neonJs.default.create.query({
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
        script: typeof (invoke) === 'string' ? invoke : neonJs.sc.createScript(invoke),
        gas: gasCost,
        attributes: [
          {
            usage: 32,
            data: neonJs.u.reverseHex(tmpSenderAccount.scriptHash),
          },
        ],
        privateKey: tmpSenderAccount.privateKey,
      }

      const unsignedTx = new neonJs.tx.Transaction(txConfig)
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
      if (parseInt(contractScriptHash, 16) > parseInt(tmpSenderAccount.scriptHash, 16)) {
        signedTx.scripts.push(contractScriptSigning)
      } else {
        signedTx.scripts.unshift(contractScriptSigning)
      }

      return neonJs.rpc.Query.sendRawTransaction(signedTx).execute(endpt)
    })
    .then((res) => {
      if (res.result === true) {
        res.txid = signedTx.hash
      }
      return res
    })
}

neonGetUnspent(apiEndpoint, contractScriptHash)
  .then(unspent => {
    for (const vin of unspent) {
      console.log(vin.txid)
      neonGetAddressOfTx(apiEndpoint, vin.txid)
        .then(address => {
          console.log(`${vin.txid} -> ${address}`)
          neonJsClaim(address, net, contractScriptHash, vin.txid)
        })
    }
  })
  .catch(e =>
    console.log('ERROR', e.message)
  )
