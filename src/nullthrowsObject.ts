type NonNullableMap<T> = { [P in keyof T]: NonNullable<T[P]> };

/**
 * Asserts `value` is not null/undefined, and all enumerable properties of
 *`value` are not null/undefined.
 *
 * NOTE: If the type of `value` contains optional properties, the return type
 * will still have optional properties! To remove optional properties,
 * use `nullthrowsObjectMap` instead.
 *
 * Examples:
 *   ```ts
 *   const foo: { foo: string | null } = { foo: '' };
 *   const bar: { bar: number | null | undefined } = { bar: 123 };
 *   const baz: { baz?: number } = { };
 *   const bing: { bing: number | null } = { bing: null };
 *
 *   nullthrowsObject(foo);    // RETURN TYPE: { foo: string }
 *   nullthrowsObject(bar);    // RETURN TYPE: { bar: number }
 *   nullthrowsObject(baz);    // RETURN TYPE: { baz?: number | undefined }
 *   nullthrowsObject(bing);   // THROWS: 'Found unexpected "null" for property: "bing"'
 *   ```
 */
export default function nullthrowsObject<T>(object: T | null | undefined, message?: string) {
  // check object is not null
  if (object == null) {
    const objectType = typeof object === 'undefined' ? 'undefined' : 'null';
    const objectError = `Found unexpected "${objectType}"`;
    throw new Error(message ? `${message} (${objectError})` : objectError);
  }
  // check all properties are non-null
  Object.entries(object).forEach(([key, value]) => {
    if (value == null) {
      const valueType = typeof value === 'undefined' ? 'undefined' : 'null';
      const keyError = `Found unexpected "${valueType}" for property: "${key}"`;
      throw new Error(message ? `${message} (${keyError})` : keyError);
    }
  });
  return object as NonNullableMap<T>;
}
