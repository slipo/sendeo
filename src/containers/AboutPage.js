import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Sticky from 'react-stickynode'
import ScrollableAnchor from 'react-scrollable-anchor'

import './AboutPage.css'

class AboutPage extends Component {
  render() {
    return (
      <div>
        <Sticky>
          <nav className='main-nav-outer'>
            <div className='container'>
              <ul className='main-nav'>
                <li><Link to='/?asset=neo#get-started'>Send NEO</Link></li>
                <li><Link to='/?asset=gas#get-started'>Send GAS</Link></li>
                <li><Link to='/previousSends'>Previous Sends</Link></li>
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
            <ScrollableAnchor id={ 'get-started' } offset={ '400' }>
              <h2>About SENDEO</h2>
            </ScrollableAnchor>
            <h6>Basically the pursuit of knowledge and that which we don't know about, but like.</h6>
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
