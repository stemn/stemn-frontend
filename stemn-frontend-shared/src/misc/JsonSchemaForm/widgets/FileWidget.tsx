import { WidgetProps } from '@rjsf/utils'

import Upload from 'stemn-shared/misc/Upload/Upload'

export const FileWidget = (props: WidgetProps) => {

  const { className } = props
  return (
    <div className={className}>
      <Upload
        // containerClassName={ classes.container }
        // imageClassName={ classes.image }
        // uploadId={ uploadId }
        // onUpload={ this.onUpload }
      />
    </div>
  )
}
