import * as React from 'react';
import { ArrayFieldTemplateProps } from 'react-jsonschema-form';

import MdClose from 'react-icons/md/close'
import MdAdd from 'react-icons/md/add'
import FilledIconButton from 'stemn-shared/misc/Buttons/FilledIconButton'

export const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {

  console.log({add: props.canAdd})

  return (
    <div>
      {props.items.map((component, idx) => {
        return (
          <div
            key={ idx }
            style={{ position: 'relative' }}
          >
            { component.children }

            <FilledIconButton
              onClick={ component.onDropIndexClick(component.index) }
              style={{ position: 'absolute', top: '5px', right: '5px' }}
            >
              <MdClose size={ 20 } />
            </FilledIconButton>
          </div>
        )
      })}

      {props.canAdd && (

        <div>
          <FilledIconButton
            onClick={props.onAddClick}
            className="primary"
          >
            <MdAdd size={ 20 } />
          </FilledIconButton>

        </div>
      )}

    </div>
  )
}
