/**
 * What a diff viewer shows until its diff is ready: the conversion in progress, an error, or for files the API cannot
 * diff a notice above the caller's plain side-by-side comparison.
 */
import * as React from 'react'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import classes from './FileDiffView.module.scss'
import type { IDiffLoadState } from './useDiffLoad'

export const DiffLoadStatus = ({
  load,
  unsupportedNotice,
  renderFallback,
}: {
  load: Exclude<IDiffLoadState<object>, { status: 'ready' }>
  /** Which formats can be diffed, for the notice above the fallback */
  unsupportedNotice: string
  renderFallback?: () => React.ReactNode
}) => {
  if (load.status === 'unsupported') {
    return (
      <div className="layout-column flex" data-testid="diff-unsupported">
        <div className={classes.notice}>
          {unsupportedNotice} These revisions are compared side by side.{' '}
          <span className={classes.muted}>{load.error.message}</span>
        </div>
        {renderFallback ? renderFallback() : null}
      </div>
    )
  }
  if (load.status === 'error') {
    return (
      <div className="layout-column layout-align-center-center flex" data-testid="diff-error">
        <div className="text-title-5">{load.error.message}</div>
      </div>
    )
  }
  return (
    <div
      className="layout-column flex rel-box"
      data-testid={load.status === 'pending' ? 'diff-pending' : 'diff-loading'}
    >
      <LoadingOverlay show>
        {load.status === 'pending' ? 'Converting the revisions for the diff...' : 'Loading the diff...'}
      </LoadingOverlay>
    </div>
  )
}
