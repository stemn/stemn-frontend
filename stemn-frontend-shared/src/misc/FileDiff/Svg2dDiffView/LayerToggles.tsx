/** The layers of a 2D drawing, each shown or hidden in both revisions; a popover in the viewer's toolbar */
import diffClasses from '../FileDiffView/FileDiffView.module.scss'
import classes from './Svg2dDiffView.module.scss'
import type { ISvgLayer } from './svgDocument'

export const LayerToggles = ({
  layers,
  hidden,
  onToggle,
}: {
  layers: ISvgLayer[]
  hidden: Set<string>
  onToggle: (id: string) => void
}) =>
  layers.length ? (
    <details className={classes.layers} data-testid="diff-layers">
      <summary className={diffClasses.tool} title="Show or hide layers">
        Layers {layers.length - hidden.size}/{layers.length}
      </summary>
      <div className={classes.layerList}>
        {layers.map((layer) => (
          <label key={layer.id}>
            <input
              type="checkbox"
              checked={!hidden.has(layer.id)}
              onChange={() => onToggle(layer.id)}
              data-testid="diff-layer"
              data-layer={layer.id}
            />
            {layer.name}
          </label>
        ))}
      </div>
    </details>
  ) : null
