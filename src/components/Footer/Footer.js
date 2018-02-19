import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import logo from '../../images/sendeo-logo-inline-white.png'
import './Footer.css'

class Footer extends Component {
  render() {
    return (
      <div className='footer container'>
        <p><img src={ logo } alt='Sendeo Logo Flat' /></p>
        <p>
          <Link to='/send?asset=neo'>Send NEO</Link> |
          <Link to='/send?asset=gas'>Send GAS</Link> |
          <Link to='/previousSends'>Your History</Link> |
          <Link to='/about'>About</Link>
        </p>
        <p><small>Copyright {(new Date().getFullYear())}</small></p>
      </div>
    )
  }
}

export default Footer
