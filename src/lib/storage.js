import Neon, { wallet, api, u } from '@cityofzion/neon-js'

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

export function neonGetBalance(scriptHash, assetId, contractScriptHash, net) {
  const query = Neon.create.query({
    'method': 'getstorage',
    'params': [
      contractScriptHash,
      u.reverseHex(scriptHash) + u.reverseHex(assetId),
    ],
  })

  return api.neonDB.getRPCEndpoint(net)
    .then((url) => {
      return query.execute(url)
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

export function neonGetEscrowInfo(scriptHash, contractScriptHash, net) {
  const query = Neon.create.query({
    'method': 'getstorage',
    'params': [
      contractScriptHash,
      u.str2hexstring('info') + scriptHash,
    ],
  })

  return api.neonDB.getRPCEndpoint(net)
    .then((url) => {
      return query.execute(url)
        .then(res => {
          let result = false
          if (res.result) {
            result = deserializeArray(res.result)
            let createdTime = new Date(parseInt(u.reverseHex(result[2]), 16))
            let dateOffset = (24 * 60 * 60 * 1000) * 7
            let sevenDaysAgo = new Date()
            sevenDaysAgo.setTime(sevenDaysAgo.getTime() - dateOffset)

            let canRescind = createdTime.created < sevenDaysAgo

            result = {
              txId: u.reverseHex(result[0]),
              note: u.hexstring2str(result[1]),
              created: new Date(parseInt(u.reverseHex(result[2]), 16) * 1000).toUTCString(),
              canRescind,
              scriptHash,
            }
          }

          return result
        })
    })
}

export function neonGetOwnedEscrowScriptHashes(ownerAddress, contractScriptHash, net) {
  console.log('ownerAddress', ownerAddress)
  const sh = wallet.getScriptHashFromAddress(ownerAddress)
  const query = Neon.create.query({
    'method': 'getstorage',
    'params': [
      contractScriptHash,
      u.str2hexstring('depositRecord') + u.reverseHex(sh),
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
