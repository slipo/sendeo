import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './LandingPage.css'
import TotalAllTime from '../../components/TotalAllTime/TotalAllTime'

class LandingPage extends Component {
  render() {
    return (
      <div>
        <section className='main-section'>
          <div className='container text-center'>
            <figure className='animated fadeInLeft delay-07s'>
              <TotalAllTime />
            </figure>

            <figure className='video-container animated fadeInRight delay-07s'>
              <iframe title='unique-title' width='800px' height='450' src='https://www.youtube.com/embed/jMUIxWVXYdw?rel=0&amp;controls=0' frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen />
            </figure>

            <Link to='/send' className='link animated fadeInUp delay-1s servicelink'>Get Started</Link>
          </div>
        </section>
      </div>
    )
  }
}

export default LandingPage
