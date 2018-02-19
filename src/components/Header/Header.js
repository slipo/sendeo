import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import logo from '../../images/sendeo-logo-inline-white.png'
import './Header.css'

class Header extends Component {
  render() {
    return (
      <nav className='main-nav-outer'>
        <div className='container'>
          <ul className='main-nav'>
            <li><Link to='/send?asset=neo'>Send NEO</Link></li>
            <li><Link to='/send?asset=gas'>Send GAS</Link></li>
            <li className='small-logo'>
              <Link to='/'>
                <img src={ logo } alt='Sendeo Logo Flat' />
              </Link>
            </li>
            <li><Link to='/previousSends'>Your History</Link></li>
            <li><Link to='/about'>About</Link></li>
          </ul>
          <button className='res-nav_click' href='#'>
            <i className='fa-bars' />
          </button>
        </div>
      </nav>
    )
  }
}

export default Header
