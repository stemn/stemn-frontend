import React from 'react'
import { connect } from 'react-redux'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import Textarea from 'react-textarea-autosize/dist/react-textarea-autosize.cjs.js'

class Component extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
    }
  }
  componentWillReceiveProps(nextProps) {
    // Update the internal state if it differs from the redux state
    if (nextProps.value !== this.state.value) {
      this.setState({
        value: nextProps.value,
      })
    }
  }
  getTextareaRef = (ref) => {
    if (ref && this.props.autoFocus) {
      ref.focus()
    }
  }
  onChange = (event) => {
    const { dispatch, model, onChange } = this.props
    const newValue = event.target.value
    // We update our internal state
    this.setState({
      value: newValue,
    })
    // Update the redux value
    dispatch(storeChange(model, newValue))
    if (onChange) { onChange() }
  }
  render() {
    const { model, dispatch, onChange, value: valueExternal, ...otherProps } = this.props
    const { value } = this.state
    return (
      <Textarea
        ref={ this.getTextareaRef }
        onChange={ this.onChange }
        value={ value }
        { ...otherProps }
      />
    )
  }
}

export default connect()(Component)
