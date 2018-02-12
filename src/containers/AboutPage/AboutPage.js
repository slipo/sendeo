import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Sticky from 'react-stickynode'

import Header from '../../components/Header/Header'
import './AboutPage.css'

class AboutPage extends Component {
  render() {
    return (
      <div>
        <Header />

        <section className='main-section'>
          <div className='container'>
            <h2>About Sendeo</h2>
            <h6>Our tiny little attempt at giving back to the NEO ecosystem.</h6>
            <div className='row'>
              <div className='col-sm-6 col-sm-offset-3 wow fadeInLeft delay-05s'>
                <p className='lead'>Help a Sister Out</p>
                <p>I wanted to send my sister some NEO but we got stuck while I waited for her to install a wallet and give me an address.
                It occurred to me that she would be much more inclined to install NEON if she knew she had NEO waiting for her.</p>
                <br />
                <p>Sendeo is my effort at solving that problem. It also serves as a great way for me to learn how to program and develop on the blockchain. Something I beleive whole heartedly in.</p>
                <br />
                <p className='lead'>Silas</p>
                <p>The man, the myth. Aspiring core developer on NeoLink, NEO, NEON, and everything else.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default AboutPage
