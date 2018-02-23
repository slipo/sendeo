const promiseMockGen = (result, error = false) => {
  return jest.fn(() => {
    return new Promise((resolve, reject) => {
      if (error) reject(error)
      resolve(result)
    })
  })
}

module.exports = {
  neonGetTotalAllTime: promiseMockGen({ result: '00a3e111' }),

  // These are just to be complete and aren't used in tests at the moment.
  neonJsClaim: promiseMockGen({ result: true }),
  neonGetIsUnspent: promiseMockGen({ result: true }),
  neonGetTxAssets: promiseMockGen({ result: true }),
  neonGetTxHistory: promiseMockGen({ result: true }),
  neonGetTxInfo: promiseMockGen({ result: true }),
}
