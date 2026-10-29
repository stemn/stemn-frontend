// Local replacement for react-codemirror 1.x over CodeMirror 5.
// Same props: value, defaultValue, onChange(value, change), options, onFocusChange(focused),
// onCursorActivity(cm), onScroll(scrollInfo), autoFocus, autoSave, name, className,
// preserveScrollPosition, codeMirrorInstance.
// Instance methods: getCodeMirror(), getCodeMirrorInstance(), focus().
// (CodeMirror base css is loaded globally from stemn-shared/assets/css/codemirror.css.)
import React from 'react'
import cn from 'classnames'
import CodeMirrorLib from 'codemirror'

export default class CodeMirror extends React.Component {
  static defaultProps = {
    preserveScrollPosition: false,
  }

  state = {
    isFocused: false,
  }

  textareaRef = React.createRef()

  getCodeMirrorInstance() {
    return this.props.codeMirrorInstance || CodeMirrorLib
  }

  componentDidMount() {
    const codeMirrorInstance = this.getCodeMirrorInstance()
    this.codeMirror = codeMirrorInstance.fromTextArea(this.textareaRef.current, this.props.options)
    this.codeMirror.on('change', this.codemirrorValueChanged)
    this.codeMirror.on('cursorActivity', this.cursorActivity)
    this.codeMirror.on('focus', this.focusChanged.bind(this, true))
    this.codeMirror.on('blur', this.focusChanged.bind(this, false))
    this.codeMirror.on('scroll', this.scrollChanged)
    this.codeMirror.setValue(this.props.defaultValue || this.props.value || '')
    this.currentOptions = { ...this.props.options }
  }

  componentWillUnmount() {
    if (this.codeMirror) {
      this.codeMirror.toTextArea()
      this.codeMirror = null
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.codeMirror) return
    const { value, options, preserveScrollPosition } = this.props

    if (
      value !== undefined &&
      value !== prevProps.value &&
      this.normalizeLineEndings(this.codeMirror.getValue()) !== this.normalizeLineEndings(value)
    ) {
      if (preserveScrollPosition) {
        const prevScrollPosition = this.codeMirror.getScrollInfo()
        this.codeMirror.setValue(value)
        this.codeMirror.scrollTo(prevScrollPosition.left, prevScrollPosition.top)
      } else {
        this.codeMirror.setValue(value)
      }
    }

    if (options && typeof options === 'object') {
      Object.keys(options).forEach((optionName) => {
        if (this.currentOptions[optionName] !== options[optionName]) {
          this.setOptionIfChanged(optionName, options[optionName])
        }
      })
      this.currentOptions = { ...options }
    }
  }

  setOptionIfChanged(optionName, newValue) {
    const oldValue = this.codeMirror.getOption(optionName)
    if (oldValue !== newValue) {
      this.codeMirror.setOption(optionName, newValue)
    }
  }

  normalizeLineEndings(str) {
    if (!str) return str
    return str.replace(/\r\n|\r/g, '\n')
  }

  getCodeMirror() {
    return this.codeMirror
  }

  focus() {
    if (this.codeMirror) {
      this.codeMirror.focus()
    }
  }

  focusChanged(focused) {
    this.setState({ isFocused: focused })
    if (this.props.onFocusChange) this.props.onFocusChange(focused)
  }

  cursorActivity = (cm) => {
    if (this.props.onCursorActivity) this.props.onCursorActivity(cm)
  }

  scrollChanged = (cm) => {
    if (this.props.onScroll) this.props.onScroll(cm.getScrollInfo())
  }

  codemirrorValueChanged = (doc, change) => {
    if (this.props.onChange && change.origin !== 'setValue') {
      this.props.onChange(doc.getValue(), change)
    }
  }

  render() {
    const editorClassName = cn(
      'ReactCodeMirror',
      { 'ReactCodeMirror--focused': this.state.isFocused },
      this.props.className,
    )
    return (
      <div className={editorClassName}>
        <textarea
          ref={this.textareaRef}
          name={this.props.name || this.props.path}
          defaultValue={this.props.value}
          autoComplete="off"
          autoFocus={this.props.autoFocus}
        />
      </div>
    )
  }
}
