import React from 'react';
import codemirror from 'codemirror'
import 'codemirror/mode/meta.js'
const requireCodemirrorMode = require.context("codemirror/mode/", true);

export default class extends React.Component{
  componentDidMount() {
    console.log(this.props.model);
  }
  render() {
    return <div ref="codemirror">
      here
    </div>
  }
};
