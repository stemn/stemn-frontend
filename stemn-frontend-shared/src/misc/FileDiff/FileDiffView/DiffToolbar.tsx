/**
 * The toolbar every diff viewer shows: unified / side by side, a toggle per class with its count, "changes only", the
 * A -> B slider (unified view), fit and the shortcuts help. `children` adds the viewer's own tools (layer toggles, a
 * storey filter) before fit.
 */
import cn from 'classnames'
import * as React from 'react'
import type { IDiffCounts } from '../diff.types'
import {
  applyShortcut,
  diffClasses,
  diffClassNames,
  diffColours,
  diffShortcuts,
  type IDiffViewState,
} from '../diff.utils'
import classes from './FileDiffView.module.scss'
import type { IDiffView } from './useDiffViewState'

export interface IDiffToolbarProps {
  view: IDiffView
  onView: (view: IDiffView) => void
  state: IDiffViewState
  setState: React.Dispatch<React.SetStateAction<IDiffViewState>>
  counts: IDiffCounts
  onFit: () => void
  showHelp: boolean
  onToggleHelp: () => void
  children?: React.ReactNode
}

export const DiffToolbar = ({
  view,
  onView,
  state,
  setState,
  counts,
  onFit,
  showHelp,
  onToggleHelp,
  children,
}: IDiffToolbarProps) => (
  <div className={`${classes.toolbar} layout-row layout-align-start-center`}>
    <div className={classes.segmented} role="group" aria-label="Diff view">
      <button
        type="button"
        className={classes.tool}
        aria-pressed={view === 'unified'}
        onClick={() => onView('unified')}
        data-testid="diff-view-unified"
        title="Unified view (U)"
      >
        Unified
      </button>
      <button
        type="button"
        className={classes.tool}
        aria-pressed={view === 'sideBySide'}
        onClick={() => onView('sideBySide')}
        data-testid="diff-view-side-by-side"
        title="Side by side (S)"
      >
        Side by side
      </button>
    </div>
    {diffClasses.map((diffClass, index) => (
      <button
        type="button"
        key={diffClass}
        className={cn(classes.tool, classes.filter)}
        aria-pressed={state.filters[diffClass]}
        onClick={() => setState((current) => applyShortcut(current, { type: 'filter', diffClass }))}
        data-testid={`diff-filter-${diffClass}`}
        title={`${diffClassNames[diffClass]} (${index + 1})`}
      >
        <span className={classes.swatch} style={{ background: diffColours[diffClass] }} />
        {diffClassNames[diffClass]}
        <span className={classes.count} data-testid={`diff-count-${diffClass}`}>
          {counts[diffClass]}
        </span>
      </button>
    ))}
    <label className={classes.check} title="Hide unchanged geometry (C)">
      <input
        type="checkbox"
        checked={state.changesOnly}
        onChange={() => setState((current) => applyShortcut(current, { type: 'changesOnly' }))}
        data-testid="diff-changes-only"
      />
      Changes only
    </label>
    {view === 'unified' ? (
      <label className={classes.slider} title="Crossfade A to B ([ and ], A and B)">
        A
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(state.blend * 100)}
          onChange={(event) => setState((current) => ({ ...current, blend: Number(event.target.value) / 100 }))}
          aria-label="A to B"
          data-testid="diff-slider"
        />
        B
      </label>
    ) : null}
    {children}
    <div className="flex" />
    <button type="button" className={classes.tool} onClick={onFit} data-testid="diff-fit" title="Fit (F)">
      Fit
    </button>
    <button
      type="button"
      className={classes.tool}
      aria-pressed={showHelp}
      onClick={onToggleHelp}
      data-testid="diff-help"
      title="Keyboard shortcuts"
    >
      ?
    </button>
  </div>
)

/** The shortcuts table the toolbar's ? button opens */
export const DiffShortcutsHelp = () => (
  <table className={classes.help} data-testid="diff-shortcuts">
    <tbody>
      {diffShortcuts.map((shortcut) => (
        <tr key={shortcut.keys}>
          <td>
            <kbd>{shortcut.keys}</kbd>
          </td>
          <td>{shortcut.action}</td>
        </tr>
      ))}
    </tbody>
  </table>
)
