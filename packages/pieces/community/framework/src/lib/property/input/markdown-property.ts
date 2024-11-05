import { Type } from '@sinclair/typebox';
import { BasePropertySchema, TPropertyValue } from './common';
import { PropertyType } from './property-type';
import { ValidationInputType } from '../../validators/types';

export type MarkdownType = 'Borderless' | 'Info' | 'Warning' | 'Tip';

export const MarkDownProperty = Type.Composite([
  BasePropertySchema,
  TPropertyValue(Type.Void(), PropertyType.MARKDOWN),
]);

export type MarkDownProperty = BasePropertySchema &
  TPropertyValue<
    undefined,
    PropertyType.MARKDOWN,
    ValidationInputType.ANY,
    false
  > & {
    markdownType?: MarkdownType;
  };
