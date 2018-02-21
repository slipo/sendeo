import React, { Component } from 'react'

import './AboutPage.css'

class AboutPage extends Component {
  render() {
    return (
      <section className='main-section'>
        <div className='container'>
          <h2 className='page-title'>About Sendeo</h2>
          <h6>Our tiny little attempt at giving back to the NEO ecosystem.</h6>
          <div className='row'>
            <div className='col-sm-6 col-sm-offset-3 wow fadeInLeft delay-05s'>
              <p className='lead black'>Help a Sister Out</p>
              <p>I (Slipo) wanted to send my sister some NEO but we got stuck while I waited for her to install a wallet and give me an address.
              It occurred to me that she would be much more inclined to install NEON if she knew she had NEO waiting for her.</p>
              <br />
              <p>Sendeo is our effort at solving this problem. It also serves as a great way for us to learn how to program and develop on the NEO
              blockchain. Something we believe whole heartedly in.</p>
              <br />
              <p className='lead black'>Made with Love by Slipo and Luke</p>
              <p>We would like to extend our deep and heart felt thanks to the NEO community and all of it's resources and talent
              and developers. We are trying to stand on the shoulders of the giants that came before us. Thank You.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default AboutPage
