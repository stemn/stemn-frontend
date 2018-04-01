import React, { Component } from 'react'
import classes from './Terminal.scss'
import Ansi from 'ansi-to-react'


export default class Terminal extends Component {
  componentWillMount() {
    const { getLines, pipelineId, stepId } = this.props
    getLines({
      pipelineId,
      stepId,
    })
  }
  render() {
    const { lines } = this.props
    return (
      <div className={ classes.outer }>
        { lines && lines.map(line => (
          <Ansi key={ line.number }>{ line.data }</Ansi>
        ))}
      </div>
    )
  }
}

//  <Ansi>{'\u001b[34mnode_modules\u001b[m\u001b[m'}</Ansi>
// {/* <Ansi>
//   { lines.map(line => line.data).join('\n') }
// </Ansi> */}
