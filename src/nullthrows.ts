/**
 * Asserts `value` is not null/undefined.
 *
 * Examples:
 *   ```ts
 *   const foo: string | null = '';
 *   const bar: number | null | undefined = 123;
 *   const baz: number | null | undefined = null;
 *
 *   nullthrows(foo);    // RETURN TYPE: string
 *   nullthrows(bar);    // RETURN TYPE: number
 *   nullthrows(baz);    // THROWS: 'Found unexpected "null"'
 *   ```
 */
export default function nullthrows<T>(value: T, message?: string) {
  if (value == null) {
    const valueType = typeof value === 'undefined' ? 'undefined' : 'null';
    const valueError = `Found unexpected "${valueType}"`;
    throw new Error(message ? `${message} (${valueError})` : valueError);
  }
  return value as NonNullable<T>;
}
