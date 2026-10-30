/**
 * The simulation viewer's own tools: what the blocks are coloured by (the diff classes, a field of A or B, or B - A),
 * the field and its component, the colour range (auto, or set by hand; symmetric for deltas), inverting the colour map,
 * and a clipping plane. And the colour legend drawn over the canvas.
 */
import classes from './PreviewSimulation.module.scss'
import {
  colourModeNames,
  componentOptions,
  cssGradient,
  type IColourMapName,
  type IColourMode,
  type IFieldView,
  legendTicks,
} from './simulation.utils'

export const SimulationControls = ({
  value,
  onChange,
  fields,
  modes,
  range,
}: {
  value: IFieldView
  onChange: (change: Partial<IFieldView>) => void
  fields: Array<{ name: string; components: number }>
  /** The colour modes offered (the diff's; a single revision has none) */
  modes?: IColourMode[]
  /** The range in use, which becomes the hand-set one when auto is turned off */
  range: [number, number] | null
}) => {
  const field = fields.find((candidate) => candidate.name === value.field)
  const showsField = value.mode !== 'classes' && Boolean(field)
  const delta = value.mode === 'delta'
  const turnOffAuto = () =>
    onChange({
      auto: false,
      ...(range ? { limit: Math.max(Math.abs(range[0]), Math.abs(range[1])) || 1, min: range[0], max: range[1] } : {}),
    })
  return (
    <>
      {modes ? (
        <div className={classes.modes} role="group" aria-label="Colour by">
          {modes.map((mode) => (
            <button
              type="button"
              key={mode}
              className={classes.mode}
              aria-pressed={value.mode === mode}
              onClick={() => onChange({ mode, field: value.field || (fields[0] ? fields[0].name : null) })}
              data-testid={`simulation-mode-${mode}`}
              title={
                mode === 'classes'
                  ? 'Colour by diff class'
                  : mode === 'delta'
                    ? 'Colour by B − A, on blocks with the same cells in A and B'
                    : `Colour by the field in ${mode.toUpperCase()}`
              }
            >
              {colourModeNames[mode]}
            </button>
          ))}
        </div>
      ) : null}
      {value.mode !== 'classes' || !modes ? (
        <label className={classes.control}>
          Field
          <select
            value={value.field || ''}
            onChange={(event) =>
              onChange({
                field: event.target.value || null,
                component: 'magnitude',
                mode: modes ? value.mode : event.target.value ? 'b' : 'classes',
              })
            }
            data-testid="simulation-field"
          >
            {modes ? null : <option value="">Blocks</option>}
            {fields.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {showsField && field && field.components > 1 ? (
        <select
          className={classes.control}
          value={String(value.component)}
          onChange={(event) =>
            onChange({ component: event.target.value === 'magnitude' ? 'magnitude' : Number(event.target.value) })
          }
          aria-label="Component"
          data-testid="simulation-component"
        >
          {componentOptions(field.components).map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      {showsField ? (
        <>
          <label className={classes.control} title={delta ? 'A range symmetric about zero' : 'The range of A and B'}>
            <input
              type="checkbox"
              checked={value.auto}
              onChange={() => (value.auto ? turnOffAuto() : onChange({ auto: true }))}
              data-testid="simulation-range-auto"
            />
            Auto range
          </label>
          {!value.auto && delta ? (
            <label className={classes.control}>
              ±
              <input
                type="number"
                value={value.limit}
                min={0}
                step="any"
                onChange={(event) => onChange({ limit: Math.abs(Number(event.target.value)) || 0 })}
                data-testid="simulation-range-limit"
              />
            </label>
          ) : null}
          {!value.auto && !delta ? (
            <>
              <input
                className={classes.control}
                type="number"
                value={value.min}
                step="any"
                onChange={(event) => onChange({ min: Number(event.target.value) })}
                aria-label="Range minimum"
                data-testid="simulation-range-min"
              />
              <input
                className={classes.control}
                type="number"
                value={value.max}
                step="any"
                onChange={(event) => onChange({ max: Number(event.target.value) })}
                aria-label="Range maximum"
                data-testid="simulation-range-max"
              />
            </>
          ) : null}
          <label className={classes.control}>
            <input
              type="checkbox"
              checked={value.invert}
              onChange={() => onChange({ invert: !value.invert })}
              data-testid="simulation-invert"
            />
            Invert
          </label>
        </>
      ) : null}
      <label className={classes.control} title="Cut the blocks with a plane">
        <input
          type="checkbox"
          checked={Boolean(value.clip)}
          onChange={() => onChange({ clip: value.clip ? null : { axis: 0, fraction: 0.5 } })}
          data-testid="simulation-clip"
        />
        Clip
      </label>
      {value.clip ? (
        <>
          <select
            className={classes.control}
            value={value.clip.axis}
            onChange={(event) =>
              onChange({
                clip: { axis: Number(event.target.value) as 0 | 1 | 2, fraction: value.clip?.fraction ?? 0.5 },
              })
            }
            aria-label="Clip axis"
          >
            <option value={0}>X</option>
            <option value={1}>Y</option>
            <option value={2}>Z</option>
          </select>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(value.clip.fraction * 100)}
            onChange={(event) =>
              onChange({ clip: { axis: value.clip?.axis ?? 0, fraction: Number(event.target.value) / 100 } })
            }
            aria-label="Clip position"
            data-testid="simulation-clip-position"
          />
        </>
      ) : null}
    </>
  )
}

export const ColourLegend = ({
  title,
  range,
  map,
  invert,
  signed,
}: {
  title: string
  range: [number, number]
  map: IColourMapName
  invert: boolean
  signed: boolean
}) => {
  const [min, middle, max] = legendTicks(range, signed)
  return (
    <div className={classes.legend} data-testid="simulation-legend">
      <div className={classes.legendTitle} data-testid="simulation-legend-title">
        {title}
      </div>
      <div className={classes.legendBar} style={{ background: cssGradient(map, invert) }} />
      <div className={classes.legendTicks}>
        <span data-testid="simulation-legend-min">{min}</span>
        <span>{middle}</span>
        <span data-testid="simulation-legend-max">{max}</span>
      </div>
    </div>
  )
}
