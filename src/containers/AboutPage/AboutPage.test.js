import React from 'react'

import { mount } from 'enzyme'

import App from '../App/App'
import AboutPage from './AboutPage'

jest.mock('../../lib/neonWrappers')

it('renders without crashing', () => {
  mount(<App><AboutPage /></App>)
})
