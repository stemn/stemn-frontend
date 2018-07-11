import * as React from 'react';
import { getLabelText } from '../utils';

interface ILabelProps {
  id: string;
  label: string;
  required: boolean;
  shrink?: boolean;
}

export const Label = (props: ILabelProps) => {
  return (
    <div
      key='label'
    >
      { getLabelText(props.label, props.required) }
    </div>
  );
};
