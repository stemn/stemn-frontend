import { FieldTemplateProps } from '@rjsf/utils'
import cn from 'classnames'
import * as React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import s from '../JsonSchemaForm.module.scss'

const transitionClassNames = {
  enter: s.enter,
  enterActive: s.enterActive,
  exit: s.leave,
  exitActive: s.leaveActive,
  appear: s.appear,
  appearActive: s.appearActive,
}

const transitionTimeout = 300

/**
 * Wraps a single element in a CSSTransition with its own nodeRef
 * (React 19 has no findDOMNode, so react-transition-group needs a ref).
 * TransitionGroup injects the `in`/`onExited` props into this component.
 */
const Fade = ({ children, ...transitionProps }: { children: React.ReactElement<any>; [key: string]: any }) => {
  const nodeRef = React.useRef<HTMLElement>(null)
  return (
    <CSSTransition {...transitionProps} nodeRef={nodeRef} classNames={transitionClassNames} timeout={transitionTimeout}>
      {React.cloneElement(children, { ref: nodeRef })}
    </CSSTransition>
  )
}

export const FieldTemplate = (props: FieldTemplateProps) => {
  const { id, classNames, label, required, rawErrors, rawHelp, children, hidden } = props

  if (hidden) {
    return <div className="hidden">{children}</div>
  }

  const header = `${label} ${required ? '*' : ''}`
  const hasErrors = rawErrors && rawErrors.length > 0

  return (
    <div className={cn(classNames, s.main)}>
      <Fade in={true} appear={true}>
        <h3 className={cn(s.main, s.header, { [s.warn]: hasErrors })}> {header} </h3>
      </Fade>

      {children}

      <TransitionGroup component={null}>
        {hasErrors
          ? rawErrors.map((error, idx) => (
              <Fade key={`${id}.${idx}`}>
                <div className={cn(s.message, s.error)}> {error} </div>
              </Fade>
            ))
          : null}
      </TransitionGroup>

      <div className={s.message}>{rawHelp}</div>
    </div>
  )
}
