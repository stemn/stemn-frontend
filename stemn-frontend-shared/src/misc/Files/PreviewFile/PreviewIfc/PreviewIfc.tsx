/**
 * The preview of an IFC model (lazy chunk): the open-source glTF viewer with the IFC property panel, which shows the
 * attributes, property sets and quantities of the product picked in the part list, and a storey filter.
 */
import * as React from 'react'
import { connect } from 'react-redux'
import { IfcPanelLoader } from '../../../FileDiff/IfcPanel/IfcPanelLoader'
import { ifcOf, storeysOf } from '../../../FileDiff/IfcPanel/ifc.utils'
import type { ICadSceneReady } from '../PreviewCadOss/CadSceneContext'
import { type IPreviewCadOssProps, PreviewCadOss } from '../PreviewCadOss/PreviewCadOss'
import { PART_FLAG } from '../PreviewCadOss/PreviewCadOss.utils'

export const PreviewIfc = (props: IPreviewCadOssProps) => {
  const [scene, setScene] = React.useState<ICadSceneReady | null>(null)
  const [selected, setSelected] = React.useState<string | null>(null)
  const [storey, setStorey] = React.useState<string | null>(null)

  const storeys = React.useMemo(() => (scene ? storeysOf([scene]) : []), [scene])

  // the products on other storeys than the one picked
  const hiddenIds = React.useMemo(() => {
    const hidden = new Set<string>()
    if (!scene || !storey) return hidden
    scene.nodesById.forEach((node, id) => {
      const ifc = ifcOf(node)
      if (node.userData[PART_FLAG] && ifc && ifc.storey !== storey) hidden.add(id)
    })
    return hidden
  }, [scene, storey])

  return (
    <PreviewCadOss {...props} onSceneReady={setScene} onIsolate={setSelected} hiddenIds={hiddenIds}>
      {scene ? (
        <div className="layout-column" style={{ width: 260 }} data-testid="ifc-preview-panel">
          <IfcPanelLoader
            node={selected ? scene.nodesById.get(selected) || null : null}
            storeys={storeys}
            storey={storey}
            onStorey={setStorey}
          />
        </div>
      ) : null}
    </PreviewCadOss>
  )
}

export default connect(({ auth }: any) => ({ token: auth.authToken }))(PreviewIfc)
