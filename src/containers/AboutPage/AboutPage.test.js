import React from 'react'
import ReactDOM from 'react-dom'

import App from '../App/App'
import AboutPage from './AboutPage'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App><AboutPage /></App>, div)
  ReactDOM.unmountComponentAtNode(div)
})
