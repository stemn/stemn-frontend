import * as React from 'react'
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form'

import Upload from 'stemn-shared/misc/Upload/Upload'

export const FileWidget = (props: WidgetProps & FieldTemplateProps) => {

  const { classNames } = props
  return (
    <div className={classNames}>
      <Upload
        // containerClassName={ classes.container }
        // imageClassName={ classes.image }
        // uploadId={ uploadId }
        // onUpload={ this.onUpload }
      />
    </div>
  )
}
