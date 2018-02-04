import Neon, { api, sc, rpc, wallet, u, tx } from '@cityofzion/neon-js'
import axios from 'axios'

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
      console.log('invoke setup')
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
      console.log('Config object just before sending', c)
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
        console.log('res,', res)
        res.txid = signedTx.hash
      }
      return res
    })
}
