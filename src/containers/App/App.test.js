import React from 'react'
import App from './App'
import { mount } from 'enzyme'

jest.mock('../../lib/neonWrappers')

it('renders without crashing', () => {
  mount(<App />)
})
