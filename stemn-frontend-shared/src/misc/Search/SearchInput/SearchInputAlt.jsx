import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CodeMirror from 'react-codemirror'
import classes from './SearchInput.css'
import cn from 'classnames'
import 'codemirror/addon/display/placeholder'
import 'codemirror/addon/selection/mark-selection'
import MdSearch from 'react-icons/md/search'

import { parseFilterStringWithPositions } from 'stemn-shared/misc/StringFilter/StringFilter.utils'

// const findQueryStrings = (value = '', filterModel) => {
//  console.log(value, filterModel);
//  return []
// //  return [{
// //    from: {
// //      line: 0,
// //      ch: 0,
// //    },
// //    to: {
// //      line: 0,
// //      ch: 10,
// //    },
// //  }]
// }

export default class EditorNew extends Component {
  static propTypes = {
    model: PropTypes.string,
    value: PropTypes.string,
    change: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  }
  constructor(props) {
    super(props)
    this.state = {
      codemirror: null,
      value: props.value,
    }
  }
  onChange = (newValue) => {
    // Update the redux value
    //     change(model, newValue)
    // Update internal value
    this.setState({
      value: newValue,
    })
  }
  getCodeMirror = (ref) => {
    if (ref) {
      const codemirror = ref.getCodeMirror()
      this.setState({
        codemirror,
      })
    }
  }
  convertQueryStrings = () => {
    const { filterModel } = this.props
    const { codemirror } = this.state

    if (codemirror) {
      // Get the position of all the valid mentions
      const filterStrings = parseFilterStringWithPositions(codemirror.getValue(), filterModel)
      filterStrings.forEach((filter) => {
        const queryStringEl = document.createElement('span')
        queryStringEl.className = classes.queryString
        queryStringEl.innerHTML = `${filter.key}:${filter.transformedValue}`
        codemirror.markText(filter.from, filter.to, {
          replacedWith: queryStringEl,
          atomic: true,
        })
      })
    }
  }
  componentDidMount() {
    setInterval(this.convertQueryStrings, 1000)
  }
  componentWillReceiveProps(nextProps) {
    // Update the internal state if it differs from the redux state
    //    this.convertQueryStrings(codemirror)
    if (nextProps.value !== this.state.value) {
      this.setState({
        value: nextProps.value,
      })
    }
  }
  render() {
    const { model, change, placeholder, className, tabIndex, ...otherProps } = this.props
    const { value } = this.state

    const options = {
      lineNumbers: false,
      dragDrop: false,
      styleSelectedText: true,
      placeholder,
      tabindex: tabIndex,
    }

    return (
      <div className={ cn(classes.search, 'layout-row layout-align-start-center', className) } { ...otherProps }>
        <CodeMirror
          ref={ this.getCodeMirror }
          className={ classes.search }
          value={ value }
          onChange={ this.onChange }
          options={ options }
        />
        <MdSearch className={ classes.icon } size={ 20 } />
      </div>
    )
  }
}
