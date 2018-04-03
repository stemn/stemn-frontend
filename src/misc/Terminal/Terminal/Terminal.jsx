import React, { Component } from 'react'
import classes from './Terminal.scss'
import classNames from 'classnames'
import Ansi from 'ansi-to-react'
import MdDown from 'react-icons/md/arrow-downward'
import MdCode from 'react-icons/md/code'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'


export default class Terminal extends Component {
  componentWillMount() {
    const { getLines, pipelineId, stepId } = this.props
    getLines({
      pipelineId,
      stepId,
    })
  }
  scrollToEnd = () => {
    window.scrollTo(0, document.body.scrollHeight);
  }
  render() {
    const { lines, rawPath } = this.props
    return (
      <div className={ classes.outer }>
        <div className={ classNames(classes.header, 'layout-row layout-align-end') }>
          <SimpleIconButton
            color="white"
            title="Scroll to Bottom"
            onClick={ this.scrollToEnd }
          >
            <MdDown size={ 22 } />
          </SimpleIconButton>
          <SimpleIconButton
            color="white"
            title="Raw Logs"
            target="_blank"
            href={ rawPath }
          >
            <MdCode size={ 22 } />
          </SimpleIconButton>
        </div>
        <div className={ classes.body }>
          { lines && lines.map(line => (
            <Ansi key={ line.number }>{ line.data }</Ansi>
          ))}
        </div>
      </div>
    )
  }
}

//  <Ansi>{'\u001b[34mnode_modules\u001b[m\u001b[m'}</Ansi>
// {/* <Ansi>
//   { lines.map(line => line.data).join('\n') }
// </Ansi> */}
