/**
 * The IFC property panel (lazy chunk, only loaded for IFC models): a storey filter and the attributes, property sets and
 * quantities of the selected product, from its glTF node. In a diff, the properties are B's (A's for removed products),
 * with the ones that changed from A marked.
 */
import cn from 'classnames'
import type { Object3D } from 'three'
import classes from './IfcPanel.module.scss'
import { formatProperty, ifcOf, type IIfcStorey, propertyGroups } from './ifc.utils'

export interface IIfcPanelProps {
  /** The selected product's node in B (or the only revision), and in A */
  node: Object3D | null
  previousNode?: Object3D | null
  storeys: IIfcStorey[]
  /** The storey shown, null for all */
  storey: string | null
  onStorey: (storey: string | null) => void
}

export const IfcPanel = ({ node, previousNode, storeys, storey, onStorey }: IIfcPanelProps) => {
  const ifc = ifcOf(node) || ifcOf(previousNode)
  const previous = node && previousNode ? ifcOf(previousNode) : null
  const groups = ifc ? propertyGroups(ifc, previous) : []
  return (
    <div className={classes.panel} data-testid="ifc-panel">
      {storeys.length ? (
        <label className={classes.storey}>
          Storey
          <select
            value={storey || ''}
            onChange={(event) => onStorey(event.target.value || null)}
            data-testid="ifc-storey-filter"
          >
            <option value="">All storeys</option>
            {storeys.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {ifc ? (
        <div data-testid="ifc-properties" data-global-id={ifc.globalId}>
          {groups.map((group) => (
            <table key={group.name} className={classes.group}>
              <thead>
                <tr>
                  <th colSpan={2}>{group.name}</th>
                </tr>
              </thead>
              <tbody>
                {group.properties.map((property) => (
                  <tr
                    key={property.name}
                    className={cn({ [classes.changed]: property.changed })}
                    data-testid="ifc-property"
                    data-group={group.name}
                    data-name={property.name}
                    data-changed={property.changed}
                  >
                    <td>{property.name}</td>
                    <td title={property.changed ? `A: ${formatProperty(property.previous)}` : undefined}>
                      {formatProperty(property.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      ) : (
        <div className={classes.empty}>Select a product to see its properties.</div>
      )}
    </div>
  )
}

export default IfcPanel
