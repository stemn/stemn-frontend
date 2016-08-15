import React from 'react';
import electron from 'electron';

// Styles
import styles from './TitleBar.css';
import classNames from 'classnames';

export default React.createClass({
  getInitialState () {
    const window = electron.remote.getCurrentWindow();
    return {
      isMaximised: window.isMaximized(),
    }
  },
  render() {
    const window = electron.remote.getCurrentWindow();

    const close = () => {
      window.close();
    }

    const minimise = () => {
      window.minimize();
    }

    const toggleMaximise = () => {
      if (!window.isMaximized()) {
        window.maximize();
        this.setState({ isMaximised: true})
      } else {
        window.unmaximize();
        this.setState({ isMaximised: false})
      }
    }


    const WindowsClose = (<svg x="0px" y="0px" viewBox="0 0 10.2 10.2" data-radium="true"><polygon fill="inherit" points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1 "></polygon></svg>)
    const WindowsMaximise = (<svg x="0px" y="0px" viewBox="0 0 10.2 10.1" data-radium="true"><path fill="inherit" d="M0,0v10.1h10.2V0H0z M9.2,9.2H1.1V1h8.1V9.2z"></path></svg>)
    const WindowsMaximised = (<svg x="0px" y="0px" viewBox="0 0 10.2 10.2" data-radium="true"><path fill="inherit" d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z"></path></svg>)
    const WindowsMinimise = (<svg x="0px" y="0px" viewBox="0 0 10.2 1" data-radium="true"><rect fill="inherit" width="10.2" height="1"></rect></svg>)

    return (
      <div className={classNames(styles.bar, 'layout-row', { [styles.light] : this.props.theme == 'light'})}>
        <div className={classNames(styles.dragger, 'flex')}></div>
         <div onClick={()=>{minimise()}} className={styles.button}>{WindowsMinimise}</div>
         <div onClick={()=>{toggleMaximise()}} className={styles.button}>{this.state.isMaximised ? WindowsMaximised : WindowsMaximise}</div>
         <div onClick={()=>{close()}} className={classNames(styles.button, styles.buttonClose)}>{WindowsClose}</div>
      </div>
    );
  }
})
