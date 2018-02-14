import React from 'react'
import { mount } from 'enzyme'

import OwnedEscrowListRow from './OwnedEscrowListRow'
import * as NeonStorageWrappers from '../../../../lib/neonWrappers'
import { GAS_ASSET_ID, NEO_ASSET_ID } from '../../../../lib/const'

it('calls neonGetTxAssets with proper props', (done) => {
  const txIdProp = 'c3b4d32715ff8de78dd8adecef2b0c1aae142660fede50e359b336fb2574d1c6'

  NeonStorageWrappers.neonGetTxInfo = jest.fn((txId, contractScriptHash, net) => {
    return new Promise((resolve, reject) => {
      expect(contractScriptHash).toEqual('TestContract')
      expect(net).toEqual('TestNet')
      expect(txId).toEqual(txIdProp)
      done()
    })
  })

  mount(<table><tbody><OwnedEscrowListRow address='123' txId={ txIdProp } contractScriptHash='TestContract' net='TestNet' /></tbody></table>)
})

it('show results on success', async () => {
  NeonStorageWrappers.neonGetTxInfo = jest.fn((txId, contractScriptHash, net) => {
    return new Promise((resolve, reject) => {
      resolve({
        note: 'NOTE',
        created: 'CREATED',
        spent: true,
        canRescind: false,
      })
    })
  })

  NeonStorageWrappers.neonGetTxAssets = jest.fn((txId, contractScriptHash, net) => {
    return new Promise((resolve, reject) => {
      const assets = {}
      assets[GAS_ASSET_ID] = 33
      assets[NEO_ASSET_ID] = 22
      resolve(assets)
    })
  })

  const txId = 'c3b4d32715ff8de78dd8adecef2b0c1aae142660fede50e359b336fb2574d1c6'
  const wrapper = mount(<table><tbody><OwnedEscrowListRow address='123' txId={ txId } contractScriptHash='TestContract' net='TestNet' /></tbody></table>)

  await Promise.resolve().then()

  expect(wrapper.text().includes('33 GAS')).toEqual(true)
  expect(wrapper.text().includes('22 NEO')).toEqual(true)
  expect(wrapper.text().includes('NOTE')).toEqual(true)
  expect(wrapper.text().includes('CREATED')).toEqual(true)
  expect(wrapper.text().includes('Already claimed/rescinded')).toEqual(true)
  expect(wrapper.text().includes('ERROR')).toEqual(false)
})

it('shows loading initially', () => {
  const txId = 'c3b4d32715ff8de78dd8adecef2b0c1aae142660fede50e359b336fb2574d1c6'
  const wrapper = mount(<table><tbody><OwnedEscrowListRow address='123' txId={ txId } contractScriptHash='TestContract' net='TestNet' /></tbody></table>)
  expect(wrapper.text().includes('Checking wallet for previous sends...')).toEqual(true)
})

it('shows rescind on if can resind', async () => {
  NeonStorageWrappers.neonGetTxInfo = jest.fn((txId, contractScriptHash, net) => {
    return new Promise((resolve, reject) => {
      resolve({
        note: 'NOTE',
        created: 'CREATED',
        spent: false,
        canRescind: true,
      })
    })
  })

  NeonStorageWrappers.neonGetTxAssets = jest.fn((txId, contractScriptHash, net) => {
    return new Promise((resolve, reject) => {
      const assets = {}
      assets[GAS_ASSET_ID] = 33
      assets[NEO_ASSET_ID] = 22
      resolve(assets)
    })
  })

  const txId = 'c3b4d32715ff8de78dd8adecef2b0c1aae142660fede50e359b336fb2574d1c6'
  const wrapper = mount(<table><tbody><OwnedEscrowListRow address='123' txId={ txId } contractScriptHash='TestContract' net='TestNet' /></tbody></table>)

  await Promise.resolve().then()

  expect(wrapper.text().includes('Rescind')).toEqual(true)
})

it('tells user rescind is not available', async () => {
  NeonStorageWrappers.neonGetTxInfo = jest.fn((txId, contractScriptHash, net) => {
    return new Promise((resolve, reject) => {
      resolve({
        note: 'NOTE',
        created: 'CREATED',
        spent: false,
        canRescind: false,
      })
    })
  })

  NeonStorageWrappers.neonGetTxAssets = jest.fn((txId, contractScriptHash, net) => {
    return new Promise((resolve, reject) => {
      const assets = {}
      assets[GAS_ASSET_ID] = 33
      assets[NEO_ASSET_ID] = 22
      resolve(assets)
    })
  })

  const txId = 'c3b4d32715ff8de78dd8adecef2b0c1aae142660fede50e359b336fb2574d1c6'
  const wrapper = mount(<table><tbody><OwnedEscrowListRow address='123' txId={ txId } contractScriptHash='TestContract' net='TestNet' /></tbody></table>)

  await Promise.resolve().then()

  expect(wrapper.text().includes('Not Yet')).toEqual(true)
})

it('shows error on error', async () => {
  const txIdProp = 'c3b4d32715ff8de78dd8adecef2b0c1aae142660fede50e359b336fb2574d1c6'

  NeonStorageWrappers.neonGetTxInfo = jest.fn((txId, contractScriptHash, net) => {
    return new Promise((resolve, reject) => {
      reject(Error('message'))
    })
  })

  const wrapper = mount(<table><tbody><OwnedEscrowListRow address='123' txId={ txIdProp } contractScriptHash='TestContract' net='TestNet' /></tbody></table>)
  await Promise.resolve().then()
  expect(wrapper.text().includes('message')).toEqual(true)
})
