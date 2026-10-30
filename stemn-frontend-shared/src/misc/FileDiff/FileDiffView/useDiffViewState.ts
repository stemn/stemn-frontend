/**
 * The state every diff viewer shares (3D, 2D): unified or side by side, the class filters, "changes only", the A -> B
 * slider and swaps, the selected and hovered entity, fit requests, and the keyboard shortcuts (diff.utils diffShortcuts)
 * while the diff is open. The viewers only differ in what they draw with it.
 */
import * as React from 'react'
import { applyShortcut, type IDiffViewState, initialViewState, shortcutFor, toggleSwap } from '../diff.utils'

export type IDiffView = 'unified' | 'sideBySide'

export const useDiffViewState = ({ initialView = 'unified', active }: { initialView?: IDiffView; active: boolean }) => {
  const [view, setView] = React.useState<IDiffView>(initialView)
  const [viewProp, setViewProp] = React.useState<IDiffView>(initialView)
  const [state, setState] = React.useState<IDiffViewState>(initialViewState)
  const [selected, setSelected] = React.useState<string | null>(null)
  const [hovered, setHovered] = React.useState<string | null>(null)
  const [fitRequest, setFitRequest] = React.useState(0)
  const [showHelp, setShowHelp] = React.useState(false)

  // the compare menu changed the mode: follow it
  if (viewProp !== initialView) {
    setViewProp(initialView)
    setView(initialView)
  }

  const requestFit = React.useCallback(() => setFitRequest((value) => value + 1), [])

  /** Selects an entity (or clears the selection) and fits the view to it */
  const select = React.useCallback((id: string | null) => {
    setSelected(id)
    if (id) setFitRequest((value) => value + 1)
  }, [])

  const swap = React.useCallback((id: string) => setState((current) => toggleSwap(current, id)), [])

  // keyboard shortcuts while the diff is shown
  React.useEffect(() => {
    if (!active) return
    const onKey = (event: KeyboardEvent) => {
      const shortcut = shortcutFor(event)
      if (!shortcut) return
      event.preventDefault()
      if (shortcut.type === 'view') setView(shortcut.view)
      else if (shortcut.type === 'fit') setFitRequest((value) => value + 1)
      else if (shortcut.type === 'clear') setSelected(null)
      else if (shortcut.type === 'swap') {
        if (selected) setState((current) => toggleSwap(current, selected))
      } else setState((current) => applyShortcut(current, shortcut))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, selected])

  return {
    view,
    setView,
    state,
    setState,
    selected,
    select,
    setSelected,
    hovered,
    setHovered,
    fitRequest,
    requestFit,
    showHelp,
    setShowHelp,
    swap,
  }
}

export type IDiffViewController = ReturnType<typeof useDiffViewState>
