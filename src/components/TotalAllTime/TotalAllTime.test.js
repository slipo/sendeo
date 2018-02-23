import React from 'react'
import { mount } from 'enzyme'

import TotalAllTime from './TotalAllTime'
import * as NeonStorageWrappers from '../../lib/neonWrappers'
import { GAS_ASSET_ID, NEO_ASSET_ID } from '../../lib/const'
import { net, contractScriptHash } from '../../AppConfig'

it('calls neonGetTotalAllTime with proper props', (done) => {
  NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHashParam, assetId, netParam) => {
    return new Promise((resolve, reject) => {
      expect(assetId).toEqual(GAS_ASSET_ID)
      expect(contractScriptHashParam).toEqual(contractScriptHash)
      expect(netParam).toEqual(net)

      NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHashParam, assetId, netParam) => {
        return new Promise((resolve, reject) => {
          expect(assetId).toEqual(NEO_ASSET_ID)
          expect(contractScriptHashParam).toEqual(contractScriptHash)
          expect(netParam).toEqual(net)
          done()
        })
      })

      resolve({ result: '00a3e111' })
    })
  })

  mount(<TotalAllTime />)
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

  const wrapper = mount(<TotalAllTime />)
  await Promise.resolve().then()
  expect(wrapper.text().includes('3 GAS')).toEqual(true)
  expect(wrapper.text().includes('2 NEO')).toEqual(true)
})

it('show 0 on invalid GAS response', async () => {
  NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
    NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
      return new Promise((resolve, reject) => { resolve({ result: '00a3e111' }) })
    })
    return new Promise((resolve, reject) => { resolve({}) })
  })
  const wrapper = mount(<TotalAllTime />)
  await Promise.resolve().then()
  expect(wrapper.text().includes('0 GAS')).toEqual(true)
})

it('show 0 on invalid NEO response', async () => {
  NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
    return new Promise((resolve, reject) => {
      NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
        return new Promise((resolve, reject) => { resolve({}) })
      })

      resolve({ result: '00a3e111' })
    })
  })
  const wrapper = mount(<TotalAllTime />)
  await Promise.resolve().then()
  expect(wrapper.text().includes('0 NEO')).toEqual(true)
})

it('show nothing on error', async () => {
  NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
    return new Promise((resolve, reject) => { reject(Error('Error Message')) })
  })
  const wrapper = mount(<TotalAllTime />)
  await Promise.resolve().then()
  expect(wrapper.text()).toEqual('')
})

it('defaults to empty', async () => {
  NeonStorageWrappers.neonGetTotalAllTime = jest.fn((contractScriptHash, assetId, net) => {
    return new Promise((resolve, reject) => { resolve({}) })
  })
  const wrapper = mount(<TotalAllTime />)
  expect(wrapper.text()).toEqual('')
})
