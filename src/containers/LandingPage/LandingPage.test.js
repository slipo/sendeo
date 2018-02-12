import React from 'react'
import { mount } from 'enzyme'

import App from '../App/App'
import LandingPage from './LandingPage'

it('renders without crashing', () => {
  const wrapper = mount(<App><LandingPage /></App>)
  expect(wrapper.find('a').prop('href')).toEqual('/send')
})
