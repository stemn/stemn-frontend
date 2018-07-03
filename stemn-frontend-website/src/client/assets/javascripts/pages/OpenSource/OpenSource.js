import React, { Component } from 'react'
import LandingLayout from 'layout/LandingLayout'
import HeroBanner from 'modules/HeroBanner'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import { Helmet } from 'react-helmet'

export default class OpenSource extends Component {
  twitterShare = () => {
    const href = 'https://twitter.com/home?status=Great engineering is open. @Stem_Network makes @OpenEngineering easy with Dropbox and Drive integration.'
    window.open(href, 'mywin', 'left=20,top=20,width=500,height=500,toolbar=1,resizable=0')
  }
  render() {
    return (
      <LandingLayout>
        <Helmet>
          <title>Greate Engineering is Open</title>
        </Helmet>
        <HeroBanner style={ { minHeight: '100vh', margin: '0px' } }>
          <div style={ { width: '680px' } }>
            <h1>Great engineering is open.</h1>
            <p>Great engineering is the result of constant iteration and relentless refinement. The best ideas grow and expand with the input of others.</p>
            <p>Open engineering is not just about the final result. It is about sharing your process; the hours of missteps and false starts you tore through, the frustration and anguish you pushed beyond, before you arrived at that final iteration. Each of those false starts is a learning experience, a teachable moment to invite others to understand not just your solution; but how you did so.</p>
            <p>Working in the open can be frightening. Exposing your work to critique requires bold effort. But with the collective, collaborative genius, together we can push the boundaries and create better work.</p>
            <h3>Be open. Build together.</h3>
            <div className="layout-xs-column layout-row layout-align-center">
              <Button style={ { margin: '10px' } } className="primary xl" name="loginRoute">Join the movement</Button>
              <Button style={ { margin: '10px' } } className="secondary xl" onClick={ this.twitterShare }>#OpenEngineering</Button>
            </div>
          </div>
        </HeroBanner>
      </LandingLayout>
    )
  }
}
