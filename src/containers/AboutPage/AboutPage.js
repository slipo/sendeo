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
              <p className='lead black'>Made with Love by slipo and l0c0luke</p>
              <p>We would like to extend our deep and heart felt thanks to the NEO community and all of it's resources and talent
              and developers. We are trying to stand on the shoulders of the giants that came before us. Thank You.</p>
              <br />
              <p className='lead black'>100% Open Source and Transparent</p>
              <p>Security and transparency have been our main priorities while developing Sendeo. To that end, our
              public <a href='https://github.com/slipo/sendeo' target='_blank' rel='noopener noreferrer'>Sendeo Github Repo</a> is MIT licensed and we
              invite you to review and improve the code.</p>
              <br />
              <p className='lead black'>Legal</p>
              <p>This code is provided for demonstration purposes only. Use at your own risk. See the <a href='https://github.com/slipo/sendeo/blob/master/LICENSE.md' target='_blank' rel='noopener noreferrer'>license</a> to learn more.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default AboutPage
