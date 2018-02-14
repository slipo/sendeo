import React from 'react'
import { mount } from 'enzyme'

import TotalAllTime from './TotalAllTime'
import * as NeonStorageWrappers from '../../../lib/neonWrappers'
import { GAS_ASSET_ID, NEO_ASSET_ID } from '../../../lib/const'

it('calls neonGetTotalAllTime with proper props', (done) => {
  NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
    return new Promise((resolve, reject) => {
      expect(assetId).toEqual(GAS_ASSET_ID)
      expect(contractScriptHash).toEqual('TestContract')
      expect(net).toEqual('TestNet')

      NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
        return new Promise((resolve, reject) => {
          expect(assetId).toEqual(NEO_ASSET_ID)
          expect(contractScriptHash).toEqual('TestContract')
          expect(net).toEqual('TestNet')
          done()
        })
      })

      resolve({ result: '00a3e111' })
    })
  })

  mount(<TotalAllTime contractScriptHash='TestContract' net='TestNet' />)
})

it('shows proper NEO/GAS amounts', async () => {
  NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
    return new Promise((resolve, reject) => {
      NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
        return new Promise((resolve, reject) => {
          resolve({ result: '00c2eb0b' })
        })
      })

      resolve({ result: '00a3e111' })
    })
  })

  const wrapper = mount(<TotalAllTime contractScriptHash='TestContract' net='TestNet' />)
  await Promise.resolve().then()
  expect(wrapper.text().includes('3 GAS')).toEqual(true)
  expect(wrapper.text().includes('2 NEO')).toEqual(true)
})

it('error on invalid GAS response', async () => {
  NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
    return new Promise((resolve, reject) => { resolve({}) })
  })
  const wrapper = mount(<TotalAllTime contractScriptHash='TestContract' net='TestNet' />)
  await Promise.resolve().then()
  expect(wrapper.state('errorMsg')).not.toEqual('')
})

it('error on invalid NEO response', async () => {
  NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
    return new Promise((resolve, reject) => {
      NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
        return new Promise((resolve, reject) => { resolve({}) })
      })

      resolve({ result: '00a3e111' })
    })
  })
  const wrapper = mount(<TotalAllTime contractScriptHash='TestContract' net='TestNet' />)
  await Promise.resolve().then()
  expect(wrapper.state('errorMsg')).not.toEqual('')
})

it('error shown on exception', async () => {
  NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
    return new Promise((resolve, reject) => { reject(Error('Error Message')) })
  })
  const wrapper = mount(<TotalAllTime contractScriptHash='TestContract' net='TestNet' />)
  await Promise.resolve().then()
  expect(wrapper.text().includes('Error Message')).toEqual(true)
})

it('defaults to empty', async () => {
  NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
    return new Promise((resolve, reject) => { resolve({}) })
  })
  const wrapper = mount(<TotalAllTime contractScriptHash='TestContract' net='TestNet' />)
  expect(wrapper.text()).toEqual('')
})
