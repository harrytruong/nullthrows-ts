import nullthrows from './nullthrows';
import nullthrowsObjectMap from './nullthrowsObjectMap';

/**
 * Similar to nullthrowsObjectMap`, but callback `mapFn` is invoked on each
 * array element.
 *
 * Asserts `value` is not null/undefined, and the object returned by `mapFn`
 * does not have enumerable properties with null/undefined.
 *
 * This is useful for parsing GraphQL responses (see `nullthrowsObjectMap`).
 *
 * NOTE: If the type of `value` contains optional properties, the return type
 * from `mapFn` can be used to transform into non-optional properties.
 *
 * Examples:
 *   ```ts
 *   const foo: Array<{ foo: string | null } | null> = [{ foo: '?' },{ foo: '!' }];
 *   nullthrowsArrayObjectMap(foo, (o) => ({ foo: o.foo });
 *   // RETURN TYPE: Array<{ foo: string }>
 *
 *   const bar: Array<{
 *     bar: number | null;
 *     missing: string | null;
 *   } | null> = [{ bar: 123, missing: null }, { bar: 456, missing: null }];
 *   nullthrowsArrayObjectMap(bar, (o) => ({ bar: o.bar });
 *   // RETURN TYPE: Array<{ bar: number }>
 *
 *   const baz: Array<{ baz: number | null } | null> = [null, { baz: 789 }];
 *   nullthrowsArrayObjectMap(baz, (o) => ({ baz: o.baz });
 *   // THROWS: 'Found unexpected "null" for array index: "0"'
 *
 *   const bing: Array<{ bing: number | null } | null> = [{ bing: null }];
 *   nullthrowsArrayObjectMap(bing, (o) => ({ bing: o.bing });
 *   // THROWS: 'Found unexpected "null" for property: "bing"'
 *   ```
 */
export default function nullthrowsArrayObjectMap<T, TNonNullable>(
  array: ArrayLike<T | null | undefined> | null | undefined,
  mapFn: (value: T) => TNonNullable,
  message?: string,
) {
  // check `array` param is non-null
  const nonNullableArray = nullthrows(array, message);
  // check `array` param is actually an Array
  if (!Array.isArray(nonNullableArray)) {
    const arrayError = 'Found unexpected "non-array"';
    throw new Error(message ? `${message} (${arrayError})` : arrayError);
  }
  // check non-nullable elements are non-null
  return (nonNullableArray as Array<T | null | undefined>).map((value, idx) => {
    if (value == null) {
      const valueType = typeof value === 'undefined' ? 'undefined' : 'null';
      const idxError = `Found unexpected "${valueType}" for array index: "${idx}"`;
      throw new Error(message ? `${message} (${idxError})` : idxError);
    }
    // pick/transform/map `arr` element for properties we care about
    return nullthrowsObjectMap(value, mapFn, message);
  });
}
