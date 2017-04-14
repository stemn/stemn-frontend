import React, { Component, PropTypes } from 'react'
import LandingLayout from 'layout/LandingLayout'
import HeroBanner from 'modules/HeroBanner'
import DownloadButton from 'stemn-shared/misc/DesktopReleases/DownloadButton'
import bytes from 'stemn-shared/utils/filters/bytes.js'
import { Container } from 'stemn-shared/misc/Layout'
import screenshot from './screenshot.png'
//import background from './background.jpg'

import classes from './Landing.css'

import WindowsIcon from 'stemn-shared/assets/icons/os/windows'
import LinuxIcon from 'stemn-shared/assets/icons/os/linux'
import AppleIcon from 'stemn-shared/assets/icons/os/apple'

export default class Landing extends Component {
  render() {
    const { latest } = this.props;

    return (
      <LandingLayout>
        <HeroBanner className={ classes.banner }>
          <h1>Download Stemn Desktop</h1>
          <h3>Collaboration tools for Engineers</h3>
          <DownloadButton className={ classes.downloadButton + ' secondary lg'} platform="auto" >
            Download Now
          </DownloadButton>
          <div className={ classes.screenshot }>
           <img src={screenshot}/>
          </div>
        </HeroBanner>
        <Container>
          <p>Drake Equation. Astonishment courage of our questions, two ghostly white figures in coveralls and helmets are soflty dancing consciousness preserve and cherish that pale blue dot network of wormholes a mote of dust suspended in a sunbeam Vangelis, of brilliant syntheses made in the interiors of collapsing stars culture, kindling the energy hidden in matter, astonishment at the edge of forever citizens of distant epochs, star stuff harvesting star light, Apollonius of Perga rich in heavy atoms. Star stuff harvesting star light as a patch of light? Concept of the number one. Radio telescope kindling the energy hidden in matter vanquish the impossible, extraplanetary another world, billions upon billions gathered by gravity. Science, cosmic fugue, circumnavigated citizens of distant epochs Vangelis a still more glorious dawn awaits and billions upon billions upon billions upon billions upon billions upon billions upon billions.</p>
          <p>Drake Equation. Astonishment courage of our questions, two ghostly white figures in coveralls and helmets are soflty dancing consciousness preserve and cherish that pale blue dot network of wormholes a mote of dust suspended in a sunbeam Vangelis, of brilliant syntheses made in the interiors of collapsing stars culture, kindling the energy hidden in matter, astonishment at the edge of forever citizens of distant epochs, star stuff harvesting star light, Apollonius of Perga rich in heavy atoms. Star stuff harvesting star light as a patch of light? Concept of the number one. Radio telescope kindling the energy hidden in matter vanquish the impossible, extraplanetary another world, billions upon billions gathered by gravity. Science, cosmic fugue, circumnavigated citizens of distant epochs Vangelis a still more glorious dawn awaits and billions upon billions upon billions upon billions upon billions upon billions upon billions.</p>
          <p>Drake Equation. Astonishment courage of our questions, two ghostly white figures in coveralls and helmets are soflty dancing consciousness preserve and cherish that pale blue dot network of wormholes a mote of dust suspended in a sunbeam Vangelis, of brilliant syntheses made in the interiors of collapsing stars culture, kindling the energy hidden in matter, astonishment at the edge of forever citizens of distant epochs, star stuff harvesting star light, Apollonius of Perga rich in heavy atoms. Star stuff harvesting star light as a patch of light? Concept of the number one. Radio telescope kindling the energy hidden in matter vanquish the impossible, extraplanetary another world, billions upon billions gathered by gravity. Science, cosmic fugue, circumnavigated citizens of distant epochs Vangelis a still more glorious dawn awaits and billions upon billions upon billions upon billions upon billions upon billions upon billions.</p>
        </Container>
      </LandingLayout>
    )
  }
}
