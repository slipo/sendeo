import React from 'react'
import { mount } from 'enzyme'
import { wallet } from '@cityofzion/neon-js'

import RescindButton from './RescindButton'
import * as NeonInvocationWrappers from '../../../../../lib/neonWrappers'

it('calls neonJsClaim with proper props', (done) => {
  NeonInvocationWrappers.neonJsClaim = jest.fn((address, wif, net, contractScriptHash, txId) => {
    return new Promise((resolve, reject) => {
      expect(address).toEqual('123')
      expect(contractScriptHash).toEqual('TestContract')
      expect(net).toEqual('TestNet')
      expect(txId).toEqual('1')
      expect(wallet.isWIF(wif)).toEqual(true)
      done()
    })
  })

  const wrapper = mount(<RescindButton address='123' txId='1' contractScriptHash='TestContract' net='TestNet' />)
  wrapper.find('a').simulate('click')
})

it('show success message on success', async () => {
  NeonInvocationWrappers.neonJsClaim = jest.fn((address, wif, net, contractScriptHash, txId) => {
    return new Promise((resolve, reject) => {
      resolve({})
    })
  })

  const wrapper = mount(<RescindButton address='123' txId='1' contractScriptHash='TestContract' net='TestNet' />)
  wrapper.find('a').simulate('click')
  await Promise.resolve().then()
  expect(wrapper.text().includes('SUCCESS!')).toEqual(true)
  expect(wrapper.text().includes('Loading...')).toEqual(false)
  expect(wrapper.text().includes('ERROR')).toEqual(false)
  expect(wrapper.text().includes('Rescind')).toEqual(false)
})

it('shows error on error', async () => {
  NeonInvocationWrappers.neonJsClaim = jest.fn((address, wif, net, contractScriptHash, txId) => {
    return new Promise((resolve, reject) => {
      reject(Error('message'))
    })
  })
  const wrapper = mount(<RescindButton address='123' txId='1' contractScriptHash='TestContract' net='TestNet' />)
  wrapper.find('a').simulate('click')
  await Promise.resolve().then()
  expect(wrapper.text().includes('message')).toEqual(true)
})

it('only shows rescind on load', async () => {
  const wrapper = mount(<RescindButton address='123' txId='1' contractScriptHash='TestContract' net='TestNet' />)
  expect(wrapper.text().includes('SUCCESS!')).toEqual(false)
  expect(wrapper.text().includes('Loading...')).toEqual(false)
  expect(wrapper.text().includes('ERROR')).toEqual(false)
  expect(wrapper.text().includes('Rescind')).toEqual(true)
})
