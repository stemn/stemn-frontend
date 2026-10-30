/**
 * The entity panel every diff viewer shows: the entities of the classes whose filter is on (by class, then label), a
 * click selects one and fits the view to it, and the selected entity's details: its class summary, a rename or a
 * match by shape, the swap and the attribute deltas. `details` adds the viewer's own rows to the selected entity's details
 * (field deltas), `children` adds panels below them (IFC properties).
 */
import * as React from 'react'
import type { IDiffEntity, IDiffManifest } from '../diff.types'
import { classSummary, diffClassNames, diffColours, formatDelta, formatValue } from '../diff.utils'
import classes from './FileDiffView.module.scss'

export const EntityDetails = ({
  entity,
  manifest,
  swapped,
  onSwap,
  children,
}: {
  entity: IDiffEntity
  manifest: IDiffManifest
  swapped: boolean
  onSwap: () => void
  /** The viewer's own details of the entity, below the deltas */
  children?: React.ReactNode
}) => (
  <div className={classes.details} data-testid="diff-entity-details" data-entity-id={entity.id}>
    <div className={classes.detailsTitle}>{entity.label}</div>
    <div className={classes.summary} data-testid="diff-entity-summary">
      <span className={classes.swatch} style={{ background: diffColours[entity.class] }} />
      {classSummary(entity, manifest.units.length)}
    </div>
    {entity.idA && entity.idB && entity.idA !== entity.idB ? (
      <div className={classes.muted}>Renamed from {entity.idA}</div>
    ) : null}
    {entity.match.method && entity.match.method !== 'id' ? (
      <div className={classes.muted}>
        Matched by {entity.match.method === 'instance' ? 'instance' : 'shape and position'}, confidence{' '}
        {Math.round(entity.match.confidence * 100)}%
      </div>
    ) : null}
    {entity.class === 'modified' || entity.class === 'moved' ? (
      <button
        type="button"
        className={classes.tool}
        aria-pressed={swapped}
        onClick={onSwap}
        data-testid="diff-swap"
        title="Swap A and B for this entity (X)"
      >
        {swapped ? 'Showing A solid' : 'Swap A / B'}
      </button>
    ) : null}
    {entity.changes.length ? (
      <table className={classes.deltas} data-testid="diff-deltas">
        <thead>
          <tr>
            <th>Attribute</th>
            <th>A</th>
            <th>B</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {entity.changes.map((change) => (
            <tr key={change.attribute} data-testid="diff-delta" data-attribute={change.attribute}>
              <td>{change.attribute}</td>
              <td>{formatValue(change.a, manifest.units[change.attribute])}</td>
              <td>{formatValue(change.b, manifest.units[change.attribute])}</td>
              <td>{formatDelta(change, manifest.units[change.attribute])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : null}
    {children}
  </div>
)

export interface IDiffEntityPanelProps {
  manifest: IDiffManifest
  /** The rows to list (panelEntities of the manifest, perhaps narrowed further by the viewer) */
  rows: IDiffEntity[]
  selected: string | null
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
  swapped: Set<string>
  onSwap: (id: string) => void
  /** The viewer's own details of the selected entity (inside EntityDetails, below the deltas) */
  details?: (entity: IDiffEntity) => React.ReactNode
  /** Panels below the details */
  children?: React.ReactNode
}

export const DiffEntityPanel = ({
  manifest,
  rows,
  selected,
  onSelect,
  onHover,
  swapped,
  onSwap,
  details,
  children,
}: IDiffEntityPanelProps) => {
  const selectedEntity = selected ? manifest.entities.find((entity) => entity.id === selected) || null : null
  return (
    <div className={classes.panel} data-testid="diff-panel">
      <div className={classes.panelTitle}>
        {manifest.entities.length} {manifest.entities.length === 1 ? 'entity' : 'entities'}
      </div>
      <div className={classes.rows}>
        {rows.map((entity) => (
          <button
            type="button"
            key={entity.id}
            className={classes.row}
            aria-pressed={selected === entity.id}
            onClick={() => onSelect(selected === entity.id ? null : entity.id)}
            onMouseEnter={() => onHover(entity.id)}
            onMouseLeave={() => onHover(null)}
            data-testid="diff-entity"
            data-entity-id={entity.id}
            data-class={entity.class}
            title={entity.id}
          >
            <span className={classes.swatch} style={{ background: diffColours[entity.class] }} />
            <span className="flex text-ellipsis">{entity.label}</span>
            <span className={classes.muted}>{diffClassNames[entity.class]}</span>
          </button>
        ))}
        {rows.length === 0 ? <div className={classes.empty}>No entities in the selected classes.</div> : null}
      </div>
      {selectedEntity ? (
        <EntityDetails
          entity={selectedEntity}
          manifest={manifest}
          swapped={swapped.has(selectedEntity.id)}
          onSwap={() => onSwap(selectedEntity.id)}
        >
          {details ? details(selectedEntity) : null}
        </EntityDetails>
      ) : null}
      {children}
    </div>
  )
}
