// Container Core
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// Container Actions
import * as WalkthroughActions from './Walkthrough.actions.js'

// Component Core
import React from 'react'
import PropTypes from 'prop-types'
import { omit } from 'lodash'
import { getStepData } from './Walkthrough.config.js'

import classes from './Walkthrough.css'

import Popover from 'stemn-shared/misc/Popover'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdClose from 'react-icons/md/close'

const WalkthroughPropTypes = {
  children: PropTypes.node,      // Child element
  name: PropTypes.string,    //
}
// /////////////////////////////// COMPONENT /////////////////////////////////

export class Walkthrough extends React.Component {
  static propTypes = WalkthroughPropTypes;

  render() {
    const { children, name } = this.props
    const { walkthroughActions, walkthrough } = this.props
    const isActive = walkthrough.active.includes(name)
    const data     = getStepData(name)

    const getNext = (stepName, steps) => {
      const currentIndex = steps.indexOf(stepName)
      return currentIndex !== -1 && currentIndex + 1 < steps.length ? steps[currentIndex + 1] : undefined
    }
    const getPrev = (stepName, steps) => {
      const currentIndex = steps.indexOf(stepName)
      return currentIndex !== -1 && currentIndex - 1 >= 0 ? steps[currentIndex - 1] : undefined
    }

    const nextStep = getNext(name, data.steps)
    const prevStep = getPrev(name, data.steps)

    const next = () => {
      walkthroughActions.deactivate({ name })
      walkthroughActions.activate({
        name: nextStep,
      })
    }

    const prev = () => {
      walkthroughActions.deactivate({ name })
      walkthroughActions.activate({
        name: prevStep,
      })
    }
    const close = () => {
      walkthroughActions.deactivate({ name })
    }

    return (
      <Popover
        { ...omit(this.props, Object.keys(WalkthroughPropTypes)) }
        open={ isActive }
        trigger="none"
        tipSize={ 6 }
      >
        {children || <div />}
        <div className={ classes.walkthrough }>
          <SimpleIconButton style={ { position: 'absolute', top: '2px', right: '4px' } } onClick={ close }>
            <MdClose size="10" />
          </SimpleIconButton>
          {data.step.content}
          <div style={ { marginTop: '12px' } }>
            { nextStep
              ? <a className="link-primary" onClick={ next }>Next</a>
              : <a className="link-primary" onClick={ close }>Finish</a> }
            { prevStep
              ? <a className="link-grey" style={ { marginLeft: '10px' } } onClick={ prev }>Previous</a>
              : null }
          </div>
        </div>
      </Popover>
    )
  }
}

// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ walkthrough }) {
  return { walkthrough }
}

function mapDispatchToProps(dispatch) {
  return {
    walkthroughActions: bindActionCreators(WalkthroughActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Walkthrough)
