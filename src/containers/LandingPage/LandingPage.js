import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import stackedLogo from '../../images/sendeo-logo-stacked.png'
import './LandingPage.css'

class LandingPage extends Component {
  render() {
    return (
      <div>
        <Header />
        <section className='main-section'>
          <div className='container text-center'>
            <figure className='logo-image-container animated fadeInDown delay-07s'>
              <img src={ stackedLogo } alt='Sendeo Stacked Logo' />
            </figure>
            <figure className='animated fadeInLeft delay-07s'>
              <h3>The easiest way to share the NEO blockchain</h3>
            </figure>

            <figure className='video-container animated fadeInRight delay-07s'>
              <iframe title='unique-title' width='560' height='315' src='https://www.youtube.com/embed/8PYKOo_jgJo?rel=0&amp;controls=0' frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen />
            </figure>

            <Link to='/send' className='link animated fadeInUp delay-1s servicelink'>Get Started</Link>
          </div>
        </section>
      </div>
    )
  }
}

export default LandingPage
