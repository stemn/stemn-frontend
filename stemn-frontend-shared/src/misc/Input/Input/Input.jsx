import React from 'react'
import { connect } from 'react-redux'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import { omit } from 'lodash'

export class Component extends React.Component {
  state = {
    value: this.props.value,
  };

  onChange = (event) => {
    const {
      model,
      type,
      changeAction,
    } = this.props
    const prevValue = this.state.value
    let newValue = event.target.value

    // Convert 'true' and 'false' to bool
    if (newValue === 'true') {
      newValue = true
    } else if (newValue === 'false') {
      newValue = false
    }

    // Toggle if checkbox
    // Value can be: true || false || 'other' || undefined
    if (type === 'checkbox') {
      const isFalse = prevValue === 'false' || prevValue === false || prevValue === undefined
      newValue = !!isFalse // toggle
    }

    if (model) {
      // If model exists, we dispatch an update
      this.props.dispatch(storeChange(model, newValue))
    }
    if (changeAction) {
      // If a changeActions exists, we run it
      changeAction({ value: newValue, model })
    }
    // We update our internal state
    this.setState({ value: newValue })
  };

  componentWillReceiveProps(nextProps) {
    // Update the internal state if it differs from the redux state
    if (nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value })
    }
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      setTimeout(() => this.refs.input.focus(), 1)
    }
  }

  render() {
    const otherProps = omit(this.props, ['dispatch', 'model', 'value', 'changeAction'])
    const { value } = this.state
    return <input ref="input" { ...otherProps } onChange={ this.onChange } value={ value } />
  }
}

export default connect()(Component)
