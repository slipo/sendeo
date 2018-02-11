import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../images/logo-stacked.png'
import './LandingPage.css'

class LandingPage extends Component {
  render() {
    return (
      <div>
        <header className='header' id='header'>
          <div className='container'>
            <figure className='animated fadeInDown delay-07s'>
              <img src={ logo } />
              <figure className='animated fadeInLeft delay-07s'>
                <h2>The easiest way to share the NEO blockchain</h2>
              </figure>
            </figure>

            <figure className='video-container animated fadeInRight delay-07s'>
              <iframe width='560' height='315' src='https://www.youtube.com/embed/8PYKOo_jgJo?rel=0&amp;controls=0' frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen />
            </figure>

            <Link to='/send' className='link animated fadeInUp delay-1s servicelink'>Get Started</Link>
          </div>
        </header>
      </div>
    )
  }
}

export default LandingPage
