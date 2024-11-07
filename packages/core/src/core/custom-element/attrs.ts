import type { SignalOptions } from '@maverick-js/signals';
import { isArray } from '@maverick-js/std';

export type AttributeValue = string | null;

export type Attributes<Props> = {
  [P in keyof Props]?: string | false | Attribute<Props[P]>;
};

export interface AttributeConverter<Value = unknown> {
  (value: AttributeValue): Value;
}

export interface Attribute<Value = unknown> extends SignalOptions<Value> {
  /**
   * Whether the property is associated with an attribute, or a custom name for the associated
   * attribute. By default this is `true` and the attribute name is inferred by kebab-casing the
   * property name.
   */
  attr?: string | false;
  /**
   * Convert between an attribute value and property value. If not specified it will be inferred
   * from the initial value.
   */
  converter?: AttributeConverter<Value>;
}

export const STRING_ATTR: AttributeConverter<string | null> = (v) => (v === null ? '' : v + '');

export const NULLABLE_STRING_ATTR: AttributeConverter<string | null> = (v) =>
  v === null ? null : v + '';

export const NUMBER_ATTR: AttributeConverter<number | null> = (v) => (v === null ? 0 : Number(v));

export const NULLABLE_NUMBER_ATTR: AttributeConverter<number | null> = (v) =>
  v === null ? null : Number(v);

export const BOOLEAN_ATTR: AttributeConverter<boolean | null> = (v) => v !== null;

export const FUNCTION_ATTR: AttributeConverter<(() => void) | null> = () => null;

export const ARRAY_ATTR: AttributeConverter<unknown[] | null> = (v) =>
  v === null ? [] : JSON.parse(v);

export const OBJECT_ATTR: AttributeConverter<object | null> = (v) =>
  v === null ? {} : JSON.parse(v);

export function inferAttributeConverter(value: unknown): AttributeConverter<any> {
  if (value === null) return NULLABLE_STRING_ATTR;
  switch (typeof value) {
    case 'undefined':
      return STRING_ATTR;
    case 'string':
      return STRING_ATTR;
    case 'boolean':
      return BOOLEAN_ATTR;
    case 'number':
      return NUMBER_ATTR;
    case 'function':
      return FUNCTION_ATTR;
    case 'object':
      return isArray(value) ? ARRAY_ATTR : OBJECT_ATTR;
    default:
      return STRING_ATTR;
  }
}