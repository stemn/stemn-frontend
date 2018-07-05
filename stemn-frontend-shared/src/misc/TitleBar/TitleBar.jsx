import React from 'react'
import electron from 'electron'
import process from 'process'

// Styles
import styles from './TitleBar.css'
import cn from 'classnames'

import MaximiseIcon from './icons/maximise.js'
import CloseIcon from './icons/close.js'
import MinimiseIcon from './icons/minimise.js'

export default class TitleBar extends React.Component {
  constructor(props) {
    super(props)
    const window = electron.remote.getCurrentWindow()

    this.state = {
      isMaximised: window.isMaximized(),
    }
  }

  render() {
    const window = electron.remote.getCurrentWindow()

    const close = () => {
      window.close()
    }

    const minimise = () => {
      window.minimize()
    }

    const toggleMaximise = () => {
      if (!window.isMaximized()) {
        window.maximize()
        this.setState({ isMaximised: true })
      } else {
        window.unmaximize()
        this.setState({ isMaximised: false })
      }
    }

    //    const WindowsClose = (<svg x="0px" y="0px" viewBox="0 0 10.2 10.2" data-radium="true"><polygon fill="inherit" points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1 "></polygon></svg>)
    //    const WindowsMaximise = (<svg x="0px" y="0px" viewBox="0 0 10.2 10.1" data-radium="true"><path fill="inherit" d="M0,0v10.1h10.2V0H0z M9.2,9.2H1.1V1h8.1V9.2z"></path></svg>)
    //    const WindowsMaximised = (<svg x="0px" y="0px" viewBox="0 0 10.2 10.2" data-radium="true"><path fill="inherit" d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z"></path></svg>)
    //    const WindowsMinimise = (<svg x="0px" y="0px" viewBox="0 0 10.2 1" data-radium="true"><rect fill="inherit" width="10.2" height="1"></rect></svg>)
    //    const MacClose = (<svg x="0px" y="0px" viewBox="0 0 10 10"><path fill="#4d0000" d="M5,3.552c0.438,-0.432 0.878,-0.861 1.322,-1.287c0.049,-0.044 0.101,-0.085 0.158,-0.119c0.149,-0.091 0.316,-0.137 0.49,-0.146c0.04,0 0.04,0 0.08,0.001c0.16,0.011 0.314,0.054 0.453,0.135c0.08,0.046 0.154,0.104 0.218,0.171c0.252,0.262 0.342,0.65 0.232,0.996c-0.045,0.141 -0.121,0.265 -0.218,0.375c-0.426,0.444 -0.855,0.884 -1.287,1.322c0.432,0.438 0.861,0.878 1.287,1.322c0.097,0.11 0.173,0.234 0.218,0.375c0.04,0.126 0.055,0.26 0.043,0.392c-0.011,0.119 -0.043,0.236 -0.094,0.344c-0.158,0.327 -0.49,0.548 -0.852,0.566c-0.106,0.005 -0.213,-0.007 -0.315,-0.035c-0.156,-0.043 -0.293,-0.123 -0.413,-0.229c-0.444,-0.426 -0.884,-0.855 -1.322,-1.287c-0.438,0.432 -0.878,0.861 -1.322,1.287c-0.11,0.097 -0.234,0.173 -0.375,0.218c-0.126,0.04 -0.26,0.055 -0.392,0.043c-0.119,-0.011 -0.236,-0.043 -0.344,-0.094c-0.327,-0.158 -0.548,-0.49 -0.566,-0.852c-0.005,-0.106 0.007,-0.213 0.035,-0.315c0.043,-0.156 0.123,-0.293 0.229,-0.413c0.426,-0.444 0.855,-0.884 1.287,-1.322c-0.432,-0.438 -0.861,-0.878 -1.287,-1.322c-0.106,-0.12 -0.186,-0.257 -0.229,-0.413c-0.025,-0.089 -0.037,-0.182 -0.036,-0.275c0.004,-0.363 0.211,-0.704 0.532,-0.874c0.13,-0.069 0.272,-0.105 0.418,-0.115c0.04,-0.001 0.04,-0.001 0.08,-0.001c0.174,0.009 0.341,0.055 0.49,0.146c0.057,0.034 0.109,0.075 0.158,0.119c0.444,0.426 0.884,0.855 1.322,1.287Z"></path></svg>)
    //    const MacMinimise = (<svg x="0px" y="0px" viewBox="0 0 10 10"><path fill="#995700" d="M8.048,4.001c0.163,0.012 0.318,0.054 0.459,0.137c0.325,0.191 0.518,0.559 0.49,0.934c-0.007,0.097 -0.028,0.192 -0.062,0.283c-0.04,0.105 -0.098,0.204 -0.171,0.29c-0.083,0.098 -0.185,0.181 -0.299,0.24c-0.131,0.069 -0.271,0.103 -0.417,0.114c-2.031,0.049 -4.065,0.049 -6.096,0c-0.163,-0.012 -0.318,-0.054 -0.459,-0.137c-0.325,-0.191 -0.518,-0.559 -0.49,-0.934c0.007,-0.097 0.028,-0.192 0.062,-0.283c0.04,-0.105 0.098,-0.204 0.171,-0.29c0.083,-0.098 0.185,-0.181 0.299,-0.24c0.131,-0.069 0.271,-0.103 0.417,-0.114c2.031,-0.049 4.065,-0.049 6.096,0Z"></path></svg>)
    //    const MacMaximised = (<svg x="0px" y="0px" viewBox="0 0 10 10"><path fill="#006400" d="M5,10c0,0 0,-2.744 0,-4.167c0,-0.221 -0.088,-0.433 -0.244,-0.589c-0.156,-0.156 -0.368,-0.244 -0.589,-0.244c-1.423,0 -4.167,0 -4.167,0l5,5Z"></path><path fill="#006400" d="M5,0c0,0 0,2.744 0,4.167c0,0.221 0.088,0.433 0.244,0.589c0.156,0.156 0.368,0.244 0.589,0.244c1.423,0 4.167,0 4.167,0l-5,-5Z"></path></svg>)
    //    const MacMaximise = (<svg x="0px" y="0px" viewBox="0 0 10 10"><path fill="#006400" d="M2,3c0,0 0,2.744 0,4.167c0,0.221 0.088,0.433 0.244,0.589c0.156,0.156 0.368,0.244 0.589,0.244c1.423,0 4.167,0 4.167,0l-5,-5Z"></path><path fill="#006400" d="M8,7c0,0 0,-2.744 0,-4.167c0,-0.221 -0.088,-0.433 -0.244,-0.589c-0.156,-0.156 -0.368,-0.244 -0.589,-0.244c-1.423,0 -4.167,0 -4.167,0l5,5Z"></path></svg>)

    if (process.platform === 'darwin') {
      return null
      //      return (
      //        <div className={cn(styles.bar, 'layout-row', { [styles.light] : this.props.theme === 'light'})}>
      //          <div className={cn(styles.dragger, 'flex')}></div>
      //          <div className={styles.darwinButtons + ' layout-row layout-align-start-center'}>
      //            <div className={cn(styles.darwinButton, styles.darwinClose)}>{MacClose}</div>
      //            <div className={cn(styles.darwinButton, styles.darwinMinimise)}>{MacMinimise}</div>
      //            <div className={cn(styles.darwinButton, styles.darwinMaximise)}>{this.state.isMaximised ? MacMaximised : MacMaximise}</div>
      //          </div>
      //        </div>
      //      )
    }
    
    return (
      <div className={ cn(styles.bar, 'layout-row', { [styles.light]: this.props.theme === 'light' }) }>
        <div className={ cn(styles.dragger, 'flex') } />
        <div className={ `layout-row layout-align-end-center ${styles.buttons}` }>
          <a className={ styles.button } title="Minimise" onClick={ minimise }><MinimiseIcon size={ 24 } /></a>
          <a className={ styles.button } title="Maximise" onClick={ toggleMaximise }><MaximiseIcon size={ 24 } /></a>
          <a className={ cn(styles.button, styles.close) } title="Close"    onClick={ close }><CloseIcon size={ 24 } /></a>
        </div>
      </div>
    )
  }
}
