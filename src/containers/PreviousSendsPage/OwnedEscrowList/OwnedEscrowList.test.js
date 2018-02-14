import React from 'react'
import { mount } from 'enzyme'

import OwnedEscrowList from './OwnedEscrowList'
import * as NeonStorageWrappers from '../../../lib/storage'

it('gets rows if transactions exist', async () => {
  NeonStorageWrappers.neonGetTxHistory = jest.fn((prefix, address, contractScriptHash, net) => {
    return new Promise((resolve, reject) => {
      resolve([123])
    })
  })

  const wrapper = mount(<OwnedEscrowList address='123' contractScriptHash='TestContract' net='TestNet' />)
  wrapper.instance().renderPreviousSendRows = jest.fn()

  await Promise.resolve().then()

  expect(wrapper.instance().renderPreviousSendRows).toBeCalled()
})

it('shows error on error', async () => {
  NeonStorageWrappers.neonGetTxHistory = jest.fn((prefix, address, contractScriptHash, net) => {
    return new Promise((resolve, reject) => {
      reject(Error('message'))
    })
  })

  const wrapper = mount(<OwnedEscrowList address='123' contractScriptHash='TestContract' net='TestNet' />)
  wrapper.instance().renderPreviousSendRows = jest.fn()

  await Promise.resolve().then()

  expect(wrapper.text().includes('message')).toEqual(true)
  expect(wrapper.instance().renderPreviousSendRows).not.toBeCalled()
})

it('shows loading initially', () => {
  const wrapper = mount(<OwnedEscrowList address='123' contractScriptHash='TestContract' net='TestNet' />)
  expect(wrapper.text().includes('Checking wallet for previous sends...')).toEqual(true)
})
