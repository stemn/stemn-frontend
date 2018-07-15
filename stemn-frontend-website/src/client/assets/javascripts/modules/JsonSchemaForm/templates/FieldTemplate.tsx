import * as React from 'react'
import { FieldTemplateProps } from 'react-jsonschema-form'
import { CSSTransitionGroup } from 'react-transition-group'
import * as cn from 'classnames'
import * as s from './FieldTemplate.scss'

export const FieldTemplate = (props : FieldTemplateProps) => {
  const { id, classNames, label, required, rawErrors, help, children } = props;

  const hasErrors = rawErrors && rawErrors.length > 0
  const header = `${label} ${required ? '*' : ''}`

  const errorTransition = {
    transitionName: {
      enter: s.enter,
      enterActive: s.enterActive,
      leave: s.leave,
      leaveActive: s.leaveActive,
      appear: s.appear,
      appearActive: s.appearActive
    },
    transitionAppear: true,
    transitionAppearTimeout: 300 ,
    transitionEnterTimeout: 300 ,
    transitionLeaveTimeout: 300
  }

  return (
    <div className={ classNames }>
      <div className={ s.main }>

        <CSSTransitionGroup { ...errorTransition }>
          <h3 className={cn(s.header, {[s.warn] : hasErrors })}> { header } </h3>
        </CSSTransitionGroup>

        { children }

        { help }

        <CSSTransitionGroup { ...errorTransition } >
          { hasErrors
            ? rawErrors.map((error, idx) => (<div key={`${id}.${idx}`} className={ s.error }> {error} </div>))
            : null
          }
        </CSSTransitionGroup>

      </div>
    </div>
  );
}
