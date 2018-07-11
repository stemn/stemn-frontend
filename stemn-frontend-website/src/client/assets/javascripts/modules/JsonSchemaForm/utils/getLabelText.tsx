import { capitalize, flow, lowerCase } from 'lodash/fp';

const titleCase = flow(lowerCase, capitalize);

export const getLabelText = (label: string, required: boolean) => `${titleCase(label)}${required ? '*' : ''}`;
