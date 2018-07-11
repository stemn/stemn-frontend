import * as React from 'react';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';

import Upload from 'stemn-shared/misc/Upload/Upload'

export const FileWidget = (props: WidgetProps & FieldTemplateProps) => {

  return (
    <Upload
      // containerClassName={ classes.container }
      // imageClassName={ classes.image }
      // uploadId={ uploadId }
      // onUpload={ this.onUpload }
    />
  );
};
