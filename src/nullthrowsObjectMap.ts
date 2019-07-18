import nullthrows from './nullthrows';
import nullthrowsObject from './nullthrowsObject';

/**
 * Similar to `nullthrowsObject`, but adds a callback `mapFn`.
 *
 * Asserts `value` is not null/undefined, and the object returned by `mapFn`
 * does not have enumerable properties with null/undefined.
 *
 * This is useful for parsing GraphQL responses:
 * - helps transforming typing of `foo: string | null` into `foo: string`
 * - helps with picking/renaming fields to match component Props
 * - helps with providing sane default values
 *
 * NOTE: For working with arrays, see `nullthrowsArrayObjectMap`.
 *
 * NOTE: If the type of `value` contains optional properties, the return type
 * from `mapFn` can be used to transform into non-optional properties.
 *
 * Examples:
 *   ```ts
 *   const foo: { foo: string | null } = { foo: '' };
 *   nullthrowsObjectMap(foo, (o) => ({ foo: o.foo });
 *   // RETURN TYPE: { foo: string }
 *
 *   const bar: {
 *     bar: number | null;
 *     missing: string | null;
 *   } = { bar: 123, missing: null };
 *   nullthrowsObjectMap(bar, (o) => ({ bar: o.bar });
 *   // RETURN TYPE: { bar: number }
 *
 *   const baz: { baz: number | null } = { baz: null };
 *   nullthrowsObjectMap(baz, (o) => ({ baz: o.baz });
 *   // THROWS: 'Found unexpected "null" for property: "baz"'
 *   ```
 *
 * Example: Renaming Properties and Providing Default Values
 *          (Useful for objects with optional properties)
 *   ```ts
 *   const foo: { foo: number | null } = { foo: 123 };
 *   nullthrowsObjectMap(foo, (o) => ({ foozy: o.foo });
 *   // RETURN TYPE: { foozy: number }
 *
 *   const bar: { bar: string | null } = { bar: null };
 *   nullthrowsObjectMap(bar, (o) => ({ barzy: o.bar || '' });
 *   // RETURN TYPE: { barzy: string }
 *
 *   const baz: { baz?: number } = { };
 *   nullthrowsObjectMap(baz, (o) => ({ bazzy: o.baz || 0 });
 *   // RETURN TYPE: { bazzy: number }
 *   ```
 */
export default function nullthrowsObjectMap<T, TNonNullable>(
  object: T | null | undefined,
  mapFn: (value: T) => TNonNullable,
  message?: string,
) {
  // check `object` param is non-null
  const nonNullableObject = nullthrows(object, message);
  // pick/transform/map `object` param for properties we care about
  return nullthrowsObject(mapFn(nonNullableObject), message);
}
