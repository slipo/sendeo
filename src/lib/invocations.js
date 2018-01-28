import Neon, { api, sc, rpc, wallet, u, tx } from '@cityofzion/neon-js'

export function neonJsClaim(destinationAddress, escrowPrivateKey, net, contractScriptHash) {
  console.log(`using ${escrowPrivateKey}`)
  const escrowAccount = new wallet.Account(escrowPrivateKey)
  console.log(escrowAccount)

  console.log(1, new wallet.Account().WIF)

  const rpcEndpointPromise = api.neonDB.getRPCEndpoint(net)

  const contractAddr = wallet.getAddressFromScriptHash(contractScriptHash)
  const balancePromise = api.neonDB.getBalance(net, contractAddr)

  // todo, transfer all.
  const transferAmount = 0.00001

  // todo, check gas cost?
  const gasCost = 0

  let signedTx
  let endpt
  let balances
  let script

  return Promise.all([rpcEndpointPromise, balancePromise])
    .then((values) => {
      endpt = values[0]
      balances = values[1]

      const query = Neon.create.query({
        'method': 'getcontractstate',
        'params': [
          contractScriptHash,
        ],
      })

      return query.execute(endpt)
    })
    .then((contractState) => {
      console.log('contractState', contractState)
      script = contractState.result.script

      const intents = [
        {
          assetId: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
          value: transferAmount,
          scriptHash: wallet.getScriptHashFromAddress(destinationAddress),
        },
      ]

      const invoke = {
        scriptHash: contractScriptHash,
        operation: 't',
        args: [ '' ],
      }
      console.log('invoke setup')
      const txConfig = {
        type: 209,
        version: 1,
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

      console.log('txConfig', txConfig)
      const unsignedTx = new tx.Transaction(txConfig).calculate(balances)

      const promise = Promise.resolve(unsignedTx.sign(txConfig.privateKey))
      return promise.then((signedTx) => {
        return Object.assign(txConfig, { tx: signedTx })
      })
    })
    .then((c) => {
      console.log('Config object just before sending', c)
      signedTx = c.tx

      // todo: need to fix up neon-js to know how to do this automaatically.
      if (parseInt(contractScriptHash, 16) > parseInt(escrowAccount.scriptHash, 16)) {
        signedTx.scripts.push({
          invocationScript: '00' + signedTx.scripts[0].invocationScript,
          verificationScript: script,
        })
      } else {
        signedTx.scripts.unshift({
          invocationScript: '00' + signedTx.scripts[0].invocationScript,
          verificationScript: script,
        })
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
