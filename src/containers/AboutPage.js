import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Sticky from 'react-stickynode'

import './AboutPage.css'
import logo from '../images/logo-flat.png'

class AboutPage extends Component {
  render() {
    return (
      <div>
        <Sticky>
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
              <a className='res-nav_click' href='#'>
                <i className='fa-bars' />
              </a>
            </div>
          </nav>
        </Sticky>

        <section className='main-section'>
          <div className='container'>
            <h2>About Sendeo</h2>
            <h3>Basically the pursuit of knowledge and that which we don't know about, but like.</h3>
            <div className='row'>
              <div className='col-sm-6 col-sm-offset-3 wow fadeInLeft delay-05s'>
                <p className='lead'>This is a brain child of Silas who has done the majority of the work to make SENDEO work.</p>
                <p>It is for this competition.</p>
                <p>Here is a link to the contract github and here is how it works with a pretty picture or something.</p>
                <p>Future plans?</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default AboutPage
