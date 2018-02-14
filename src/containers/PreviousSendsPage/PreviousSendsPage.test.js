import React from 'react'
import { mount } from 'enzyme'

import App from '../App/App'
import PreviousSendsPage from './PreviousSendsPage'

it('renders without crashing', () => {
  const wrapper = mount(<App><PreviousSendsPage /></App>)
  expect(wrapper.find('.main-section a').prop('href')).toEqual('/send')
})
