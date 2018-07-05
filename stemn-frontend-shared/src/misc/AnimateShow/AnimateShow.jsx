import React from 'react'

import cn from 'classnames'

export default class AnimateShow extends React.Component {
  state = {
    showContent: this.props.show,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.show === false) {
      setTimeout(() => this.setState({ showContent: false }), 300)
    } else {
      this.setState({ showContent: true })
    }
  }

  render() {
    const getInner = () => {
      if (this.state.showContent) {
        return this.props.children
      }
    }
    return (
      <div className={ cn(this.props.animation, { [this.props.animationShow]: this.props.show }) }>
        {getInner()}
      </div>
    )
  }
}
