import { ArrayFieldItemTemplateProps, ArrayFieldTemplateProps } from '@rjsf/utils'

import { MdAdd } from 'react-icons/md'
import { MdClose } from 'react-icons/md'
import FilledIconButton from 'stemn-shared/misc/Buttons/FilledIconButton'

// rjsf v6 renders each array item through ArrayFieldItemTemplate, so the per-item
// remove button lives there and ArrayFieldTemplate only lays out items + add button.
export const ArrayFieldItemTemplate = (props: ArrayFieldItemTemplateProps) => {
  const { children, buttonsProps } = props

  return (
    <div style={{ position: 'relative' }}>
      {children}

      {buttonsProps.hasRemove && (
        <FilledIconButton
          onClick={buttonsProps.onRemoveItem}
          style={{ position: 'absolute', top: '5px', right: '5px' }}
        >
          <MdClose size={20} />
        </FilledIconButton>
      )}
    </div>
  )
}

export const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  return (
    <div>
      {props.items}

      {props.canAdd && (
        <div>
          <FilledIconButton onClick={props.onAddClick} className="primary">
            <MdAdd size={20} />
          </FilledIconButton>
        </div>
      )}
    </div>
  )
}
